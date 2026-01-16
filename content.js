// AutoMarker Aria - Content Script (Highlight Engine)

(function() {
  'use strict';

  if (window.__automarkerInitialized) return;
  window.__automarkerInitialized = true;

  const MARKER_CLASS = 'automarker-hl';
  const NEGATIVE_CLASS = 'automarker-neg';

  let currentSlots = [];
  let currentNegatives = [];
  let isEnabled = true;

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

  // Watch for dynamic content
  let debounceTimer;
  const observer = new MutationObserver((mutations) => {
    if (!isEnabled || (!currentSlots.length && !currentNegatives.length)) return;

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
      debounceTimer = setTimeout(() => highlightPage(), 150);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Auto-apply on load from storage
  async function init() {
    try {
      const data = await chrome.storage.local.get(['automarker_settings']);
      const settings = data.automarker_settings;

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
    } catch (e) {
      // Extension context invalidated
    }
  }

  // Listen for storage changes (handles AI Build scenario)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace !== 'local' || !changes.automarker_settings) return;

    const settings = changes.automarker_settings.newValue;
    if (settings?.enabled) {
      currentSlots = (settings.slots || []).filter(s => s.keyword?.trim());
      currentNegatives = settings.negatives || [];

      if (currentSlots.length > 0 || currentNegatives.length > 0) {
        highlightPage();
        setTimeout(() => highlightPage(), 800);
        setTimeout(() => highlightPage(), 2000);
      }
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
