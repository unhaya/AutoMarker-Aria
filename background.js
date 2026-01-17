// AutoMarker Aria - Background Service Worker
// Detects search queries and auto-triggers highlighting

// Search engine patterns
const SEARCH_PATTERNS = [
  { host: 'www.google.com', param: 'q' },
  { host: 'www.google.co.jp', param: 'q' },
  { host: 'www.bing.com', param: 'q' },
  { host: 'search.yahoo.com', param: 'p' },
  { host: 'search.yahoo.co.jp', param: 'p' },
  { host: 'duckduckgo.com', param: 'q' },
  { host: 'www.baidu.com', param: 'wd' }
];

// Listen for tab updates (navigation)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only trigger on complete navigation
  if (changeInfo.status !== 'complete' || !tab.url) return;

  // Check if AutoMarker is enabled
  const data = await chrome.storage.local.get(['automarker_settings']);
  const settings = data.automarker_settings;

  if (!settings?.enabled) return;

  // Check if this is a search page
  const searchQuery = extractSearchQuery(tab.url);

  if (searchQuery) {
    // Store the current search query
    await chrome.storage.local.set({ automarker_last_query: searchQuery });
  }

  // Always trigger highlight with current slots and negatives
  triggerHighlight(tabId, settings.slots || [], settings.negatives || []);
});

// Extract search query from URL
function extractSearchQuery(urlString) {
  try {
    const url = new URL(urlString);

    for (const pattern of SEARCH_PATTERNS) {
      if (url.host === pattern.host || url.host.endsWith('.' + pattern.host)) {
        const query = url.searchParams.get(pattern.param);
        if (query) return query;
      }
    }

    // Generic fallback - check common query params
    const genericParams = ['q', 'query', 'search', 'keyword', 's'];
    for (const param of genericParams) {
      const query = url.searchParams.get(param);
      if (query) return query;
    }
  } catch (e) {
    // Invalid URL
  }

  return null;
}

// Send highlight command to content script
async function triggerHighlight(tabId, slots, negatives = []) {
  const activeSlots = slots.filter(s => s.keyword?.trim());

  if (activeSlots.length === 0 && negatives.length === 0) return;

  const messageData = {
    action: 'highlight',
    data: {
      slots: activeSlots,
      negatives: negatives,
      enabled: true
    }
  };

  try {
    await chrome.tabs.sendMessage(tabId, messageData);
  } catch (e) {
    // Content script not ready, inject it
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
      await chrome.scripting.insertCSS({
        target: { tabId },
        files: ['content.css']
      });

      // Retry after injection with longer delay for dynamic pages
      setTimeout(async () => {
        try {
          await chrome.tabs.sendMessage(tabId, messageData);
        } catch (e) {
          // Still failed, give up
        }
      }, 500);
    } catch (e) {
      // Cannot inject (chrome:// pages, etc.)
    }
  }
}

// Listen for clearAll message from content script (triggered on new search)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'clearAll') {
    // Clear slots and negatives, keep other settings (same as popup clearAll)
    chrome.storage.local.get(['automarker_settings']).then(data => {
      const settings = data.automarker_settings || {};
      chrome.storage.local.set({
        automarker_settings: {
          ...settings,
          slots: [],
          negatives: []
        }
      }).then(() => {
        sendResponse({ success: true });
      });
    });
    return true; // Keep channel open for async response
  }
});

// Listen for storage changes to re-apply highlights
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== 'local') return;

  if (changes.automarker_settings) {
    const settings = changes.automarker_settings.newValue;

    if (settings?.enabled) {
      // Get active tab and apply highlights
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        triggerHighlight(tab.id, settings.slots || [], settings.negatives || []);
      }
    }
  }
});
