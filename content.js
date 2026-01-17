// AutoMarker Aria - Content Script (Highlight Engine)

(function() {
  'use strict';

  if (window.__automarkerInitialized) return;
  window.__automarkerInitialized = true;

  const MARKER_CLASS = 'automarker-hl';
  const NEGATIVE_CLASS = 'automarker-neg';

  // Default colors for auto-highlight (gradient from yellow to green)
  const AUTO_HIGHLIGHT_COLORS = [
    '#ffee58', // Yellow (L1)
    '#ffee58', // Yellow (L1)
    '#f48fb1', // Pink (L2)
    '#f48fb1', // Pink (L2)
    '#b39ddb', // Purple (L3)
    '#b39ddb', // Purple (L3)
    '#a5d6a7', // Green (L4)
    '#a5d6a7'  // Green (L4)
  ];

  let currentSlots = [];
  let currentNegatives = [];
  let isEnabled = true;
  let autoHighlightEnabled = true;

  // Listen for messages from background/popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'highlight') {
      currentSlots = message.data.slots || [];
      currentNegatives = message.data.negatives || [];
      isEnabled = message.data.enabled;

      if (isEnabled && (currentSlots.length > 0 || currentNegatives.length > 0)) {
        const count = highlightPage();
        sendResponse({ matchCount: count });
      } else {
        removeAllHighlights();
        sendResponse({ matchCount: 0 });
      }
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

    // Split by spaces, filter out negative terms (starting with -)
    const words = query.split(/\s+/).filter(word => {
      const trimmed = word.trim();
      return trimmed && !trimmed.startsWith('-');
    });

    // Remove duplicates
    return [...new Set(words)];
  }

  // Check if current page is a search results page
  function isSearchPage() {
    const hostname = location.hostname;
    return hostname.includes('google.') ||
           hostname.includes('bing.') ||
           hostname.includes('yahoo.') ||
           hostname.includes('duckduckgo.') ||
           hostname.includes('search.');
  }

  // Store auto-highlight keywords for persistence across pages
  let autoHighlightKeywords = [];
  let autoHighlightSlots = []; // Keep auto slots for MutationObserver
  let lastSearchQuery = ''; // Track last search query to detect new searches

  // Clear AI Build settings when new search is detected
  async function clearAiBuildSettings() {
    try {
      const data = await chrome.storage.local.get(['automarker_settings']);
      const settings = data.automarker_settings || {};

      // Clear slots and negatives, keep other settings
      await chrome.storage.local.set({
        automarker_settings: {
          ...settings,
          slots: [],
          negatives: []
        }
      });

      currentSlots = [];
      currentNegatives = [];
    } catch (e) {
      // Extension context invalidated
    }
  }

  // Auto-highlight search query words
  async function autoHighlightSearchQuery() {
    if (!autoHighlightEnabled) return;

    let words = [];

    // On search pages, extract query and save it
    if (isSearchPage()) {
      const query = getSearchQuery();

      // Detect new search: if query changed and we have manual slots, clear them
      if (query && query !== lastSearchQuery && currentSlots.length > 0) {
        // Check if current slots are from AI Build (not auto-highlight)
        const isAiBuildSlots = currentSlots.some(s =>
          !autoHighlightSlots.find(a => a.keyword === s.keyword)
        );

        if (isAiBuildSlots) {
          await clearAiBuildSettings();
        }
      }
      lastSearchQuery = query;

      words = parseSearchQueryWords(query);

      if (words.length > 0) {
        // Save auto-highlight keywords to storage for use on visited pages
        autoHighlightKeywords = words;
        try {
          await chrome.storage.local.set({ automarker_auto_keywords: words });
        } catch (e) {
          // Extension context invalidated
        }
      }
    } else {
      // On non-search pages, load saved keywords from storage
      if (autoHighlightKeywords.length > 0) {
        words = autoHighlightKeywords;
      } else {
        try {
          const data = await chrome.storage.local.get(['automarker_auto_keywords']);
          words = data.automarker_auto_keywords || [];
          autoHighlightKeywords = words;
        } catch (e) {
          // Extension context invalidated
        }
      }
    }

    // Skip auto-highlight if manual slots are set (and not cleared above)
    if (currentSlots.length > 0) {
      autoHighlightSlots = [];
      return;
    }

    if (words.length === 0) {
      autoHighlightSlots = [];
      return;
    }

    // Create slots from search words with default colors
    autoHighlightSlots = words.slice(0, 8).map((word, index) => ({
      keyword: word,
      color: AUTO_HIGHLIGHT_COLORS[index] || AUTO_HIGHLIGHT_COLORS[0]
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
        span.style.padding = '1px 2px';
        span.style.margin = '0 1px';
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

  // Auto-apply on load from storage
  async function init() {
    try {
      const data = await chrome.storage.local.get(['automarker_settings', 'automarker_auto_keywords']);
      const settings = data.automarker_settings;

      // Load auto-highlight setting (default: true)
      autoHighlightEnabled = settings?.autoHighlight !== false;

      // Load saved auto-highlight keywords
      autoHighlightKeywords = data.automarker_auto_keywords || [];

      if (settings?.enabled) {
        currentSlots = (settings.slots || []).filter(s => s.keyword?.trim());
        currentNegatives = settings.negatives || [];

        if (currentSlots.length > 0 || currentNegatives.length > 0) {
          // Multiple passes for dynamic content (Google loads results progressively)
          highlightPage();
          setTimeout(() => highlightPage(), 800);
          setTimeout(() => highlightPage(), 2000);
        }
      }

      // Auto-highlight search query if no manual slots and feature is enabled
      if (autoHighlightEnabled && currentSlots.length === 0) {
        autoHighlightSearchQuery();
        setTimeout(() => autoHighlightSearchQuery(), 800);
        setTimeout(() => autoHighlightSearchQuery(), 2000);
      }
    } catch (e) {
      // Extension context invalidated
    }
  }

  // Listen for storage changes (handles AI Build scenario)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local' || !changes.automarker_settings) return;

    const settings = changes.automarker_settings.newValue;

    // Update auto-highlight setting
    autoHighlightEnabled = settings?.autoHighlight !== false;

    if (settings?.enabled) {
      currentSlots = (settings.slots || []).filter(s => s.keyword?.trim());
      currentNegatives = settings.negatives || [];

      if (currentSlots.length > 0 || currentNegatives.length > 0) {
        highlightPage();
        setTimeout(() => highlightPage(), 800);
        setTimeout(() => highlightPage(), 2000);
      } else if (autoHighlightEnabled) {
        // No manual slots, try auto-highlight
        autoHighlightSearchQuery();
        setTimeout(() => autoHighlightSearchQuery(), 800);
      }
    } else {
      removeAllHighlights();
      // If master toggle is off but auto-highlight is on, still highlight search query
      if (autoHighlightEnabled) {
        autoHighlightSearchQuery();
        setTimeout(() => autoHighlightSearchQuery(), 800);
      }
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
