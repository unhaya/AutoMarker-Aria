// AutoMarker Aria - Content Script (Highlight Engine)

(function() {
  'use strict';

  if (window.__automarkerInitialized) return;
  window.__automarkerInitialized = true;

  const MARKER_CLASS = 'automarker-hl';
  const NEGATIVE_CLASS = 'automarker-neg';

  // Default colors L1-L8 (each search word gets a distinct color, up to 8)
  const DEFAULT_COLORS = [
    '#ffee58', // L1 Yellow
    '#f48fb1', // L2 Pink
    '#b39ddb', // L3 Purple
    '#a5d6a7', // L4 Green
    '#ffb74d', // L5 Orange
    '#4fc3f7', // L6 Sky
    '#e57373', // L7 Red
    '#aed581'  // L8 Lime
  ];

  // Active colors (overridden by user settings from chrome.storage)
  let activeColors = DEFAULT_COLORS.slice();

  let currentSlots = [];
  let currentNegatives = [];
  let isEnabled = true;
  let autoHighlightEnabled = true;

  // Listen for messages from background/popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'rehighlight') {
      // Re-read state from storage and re-run auto-highlight
      reloadAndHighlight().then(count => sendResponse({ matchCount: count }));
      return true;
    }

    if (message.action === 'getPageInfo') {
      sendResponse({
        query: getSearchQuery(),
        title: document.title,
        url: location.href
      });
      return true;
    }
  });

  function getSearchQuery() {
    const params = new URLSearchParams(location.search);
    return params.get('q') || params.get('query') || params.get('search') || params.get('p') || '';
  }

  // Parse search query into individual words (excluding negative terms)
  function parseSearchQueryWords(query) {
    if (!query) return [];

    // Split by spaces, strip surrounding quotes, filter out negative terms (starting with -)
    // クオート除去: "AI 検索" → AI / 検索 を個別にハイライト（クオート混入で非マッチになるバグ対策 2026-06-25）
    const words = query.split(/\s+/)
      .map(word => word.replace(/^["']|["']$/g, '').trim())
      .filter(word => word && !word.startsWith('-'));

    // Remove duplicates
    return [...new Set(words)];
  }

  // Check if current page is a search results page
  function isSearchPage() {
    const hostname = location.hostname;
    const path = location.pathname;
    if (hostname.includes('google.') && path.startsWith('/search')) return true;
    if (hostname.includes('bing.') && path.startsWith('/search')) return true;
    if (hostname === 'search.yahoo.co.jp' || hostname === 'search.yahoo.com') return true;
    if (hostname.includes('duckduckgo.')) return true;
    if (hostname === 'www.baidu.com' && path.startsWith('/s')) return true;
    if (hostname.includes('yandex.') && path.startsWith('/search')) return true;
    if (hostname.startsWith('search.')) return true;
    return false;
  }

  // Store auto-highlight keywords for persistence across pages (per-tab)
  let autoHighlightKeywords = [];
  let autoHighlightSlots = []; // Keep auto slots for MutationObserver
  let tabKey = null; // automarker_tab_{tabId}

  // タブIDを取得してtabKeyを初期化
  async function initTabKey() {
    try {
      const resp = await chrome.runtime.sendMessage({ action: 'getTabId' });
      if (resp?.tabId) tabKey = `automarker_tab_${resp.tabId}`;
    } catch (e) {
      // fallback: タブIDなしでもメモリ上のキーワードは使える
    }
  }

  // Auto-highlight search query words
  async function autoHighlightSearchQuery() {
    if (!autoHighlightEnabled) return;

    // 手動キーワードが入力されていれば優先（タブ別）
    try {
      const manualKey = tabKey ? `automarker_manual_tab_${tabKey.replace('automarker_tab_', '')}` : null;
      const cfg = manualKey ? await chrome.storage.local.get([manualKey]) : {};
      const manual = (manualKey ? cfg[manualKey] : null) || [];
      if (manual.length > 0) {
        autoHighlightSlots = manual.slice(0, 8).map((word, i) => ({
          keyword: word,
          color: activeColors[i] || activeColors[0]
        }));
        currentSlots = autoHighlightSlots;
        return;
      }
    } catch (e) { /* ignore */ }

    let words = [];

    // On search pages, extract query and save it for use on visited pages
    if (isSearchPage()) {
      const query = getSearchQuery();
      words = parseSearchQueryWords(query);

      if (words.length > 0) {
        autoHighlightKeywords = words;
        try {
          if (tabKey) await chrome.storage.local.set({ [tabKey]: words });
        } catch (e) {
          // Extension context invalidated
        }
      }
    } else {
      // On non-search pages, reuse the keywords saved for this tab
      try {
        if (tabKey) {
          const data = await chrome.storage.local.get([tabKey]);
          words = data[tabKey] || [];
        }
        // メモリにあればそちらを優先（同タブ内ナビゲーション）
        if (words.length === 0 && autoHighlightKeywords.length > 0) {
          words = autoHighlightKeywords;
        }
        autoHighlightKeywords = words;
      } catch (e) {
        // Extension context invalidated
      }
    }

    if (words.length === 0) {
      autoHighlightSlots = [];
      return;
    }

    // Create slots from search words with user-configured (or default) L1-L8 colors
    autoHighlightSlots = words.slice(0, 8).map((word, index) => ({
      keyword: word,
      color: activeColors[index] || activeColors[0]
    }));

    // Set currentSlots to auto slots for highlighting (including MutationObserver)
    currentSlots = autoHighlightSlots;
    highlightPage();
  }

  function removeAllHighlights() {
    document.querySelectorAll(`.${MARKER_CLASS}, .${NEGATIVE_CLASS}`).forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      }
    });
  }

  function highlightPage() {
    removeAllHighlights();

    if (!currentSlots.length && !currentNegatives.length) return 0;

    let totalMatches = 0;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          const tag = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'iframe', 'textarea', 'input', 'select'].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }

          if (parent.closest(`.${MARKER_CLASS}`) || parent.closest(`.${NEGATIVE_CLASS}`)) {
            return NodeFilter.FILTER_REJECT;
          }

          if (parent.isContentEditable) {
            return NodeFilter.FILTER_REJECT;
          }

          if (!node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const matches = findMatches(textNode.textContent);
      if (matches.length > 0) {
        totalMatches += matches.filter(m => m.type === 'highlight').length;
        replaceWithHighlights(textNode, matches);
      }
    });

    return totalMatches;
  }

  function findMatches(text) {
    const matches = [];

    // Find positive matches (highlights)
    currentSlots.forEach(slot => {
      if (!slot.keyword) return;

      const regex = new RegExp(escapeRegex(slot.keyword), 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          color: slot.color,
          type: 'highlight'
        });
      }
    });

    // Find negative matches (de-emphasize)
    currentNegatives.forEach(word => {
      if (!word) return;

      const regex = new RegExp(escapeRegex(word), 'gi');
      let match;

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          type: 'negative'
        });
      }
    });

    matches.sort((a, b) => a.start - b.start);
    return removeOverlaps(matches);
  }

  function removeOverlaps(matches) {
    const result = [];
    let lastEnd = -1;

    for (const match of matches) {
      if (match.start >= lastEnd) {
        result.push(match);
        lastEnd = match.end;
      }
    }

    return result;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function hexToRgba(hex, alpha = 0.4) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hex;
  }

  function replaceWithHighlights(textNode, matches) {
    const text = textNode.textContent;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    matches.forEach(match => {
      if (match.start > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.slice(lastIndex, match.start))
        );
      }

      const span = document.createElement('span');

      if (match.type === 'highlight') {
        span.className = MARKER_CLASS;
        span.style.backgroundColor = hexToRgba(match.color, 0.4);
        span.style.borderRadius = '2px';
        // padding/margin はテキスト選択を分断するため付けない（選択不可バグ対策 2026-06-25）
      } else {
        // Negative: de-emphasize with strikethrough and low opacity
        span.className = NEGATIVE_CLASS;
        span.style.opacity = '0.3';
        span.style.textDecoration = 'line-through';
        span.style.color = '#888';
      }

      span.textContent = match.text;
      fragment.appendChild(span);

      lastIndex = match.end;
    });

    if (lastIndex < text.length) {
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex))
      );
    }

    textNode.parentNode.replaceChild(fragment, textNode);
  }

  // Watch for dynamic content (including uAutoPagerize pages)
  let debounceTimer;
  const observer = new MutationObserver((mutations) => {
    // Check if we have any slots to highlight (manual or auto)
    const hasSlots = currentSlots.length > 0 || autoHighlightSlots.length > 0;
    if (!hasSlots && !currentNegatives.length) return;

    const hasNewContent = mutations.some(m =>
      m.type === 'childList' &&
      m.addedNodes.length > 0 &&
      Array.from(m.addedNodes).some(n =>
        n.nodeType === Node.ELEMENT_NODE &&
        !n.classList?.contains(MARKER_CLASS) &&
        !n.classList?.contains(NEGATIVE_CLASS)
      )
    );

    if (hasNewContent) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // 選択中はスキップ（DOM書き換えで選択が外れるのを防ぐ）
        if (!window.getSelection().isCollapsed) return;
        // Use auto slots if no manual slots
        if (currentSlots.length === 0 && autoHighlightSlots.length > 0) {
          currentSlots = autoHighlightSlots;
        }
        highlightPage();
      }, 150);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Re-read settings/colors from storage and re-apply (called on background 'rehighlight')
  async function reloadAndHighlight() {
    try {
      if (!tabKey) await initTabKey();
      const data = await chrome.storage.local.get(['automarker_settings', 'automarker_colors']);
      const settings = data.automarker_settings || {};
      applyColors(data.automarker_colors);
      isEnabled = settings.enabled !== false;
      autoHighlightEnabled = settings.autoHighlight !== false;

      if (isEnabled && autoHighlightEnabled) {
        await autoHighlightSearchQuery();
        return highlightPage();
      } else {
        removeAllHighlights();
        return 0;
      }
    } catch (e) {
      return 0;
    }
  }

  // Load L1-L8 colors from storage (fallback to defaults)
  function applyColors(colors) {
    if (Array.isArray(colors) && colors.length > 0) {
      activeColors = DEFAULT_COLORS.map((def, i) => colors[i] || def);
    } else {
      activeColors = DEFAULT_COLORS.slice();
    }
  }

  // Auto-apply on load from storage
  async function init() {
    try {
      await initTabKey();
      const data = await chrome.storage.local.get(['automarker_settings', 'automarker_colors']);
      const settings = data.automarker_settings;

      // Load colors (L1-L8)
      applyColors(data.automarker_colors);

      // Master enable (default: true) and auto-highlight (default: true)
      isEnabled = settings?.enabled !== false;
      autoHighlightEnabled = settings?.autoHighlight !== false;

      if (isEnabled && autoHighlightEnabled) {
        // Multiple passes for dynamic content (Google loads results progressively)
        autoHighlightSearchQuery();
        setTimeout(() => autoHighlightSearchQuery(), 800);
        setTimeout(() => autoHighlightSearchQuery(), 2000);
      }
    } catch (e) {
      // Extension context invalidated
    }
  }

  // Listen for storage changes (toggle / color updates from popup)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local') return;

    if (changes.automarker_colors) {
      applyColors(changes.automarker_colors.newValue);
    }

    if (changes.automarker_settings) {
      const settings = changes.automarker_settings.newValue || {};
      isEnabled = settings.enabled !== false;
      autoHighlightEnabled = settings.autoHighlight !== false;
    }

    // Re-render based on current state
    if (isEnabled && autoHighlightEnabled) {
      autoHighlightSearchQuery();
      setTimeout(() => autoHighlightSearchQuery(), 800);
    } else {
      removeAllHighlights();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
