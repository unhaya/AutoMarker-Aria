// AutoMarker Aria - Background Service Worker (highlight-only edition)
// content.js auto-highlights search words on its own (document_idle + init()).
// Background only nudges the content script to re-run on navigation / toggle changes.

// Send a re-highlight nudge to the content script (it reads state from storage itself)
async function nudge(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { action: 'rehighlight' });
  } catch (e) {
    // Content script not present yet; inject then it self-initializes
    try {
      await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
      await chrome.scripting.insertCSS({ target: { tabId }, files: ['content.css'] });
    } catch (e2) {
      // Cannot inject (chrome:// pages, etc.)
    }
  }
}

// Re-run highlight on completed navigation
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;

  const data = await chrome.storage.local.get(['automarker_settings']);
  const settings = data.automarker_settings;
  if (settings?.enabled === false) return; // default ON

  nudge(tabId);
});

// Re-run highlight on the active tab when settings/colors change from the popup
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== 'local') return;
  if (!changes.automarker_settings && !changes.automarker_colors) return;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) nudge(tab.id);
});
