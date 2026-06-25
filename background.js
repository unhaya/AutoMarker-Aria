// AutoMarker Aria - Background Service Worker
// タブIDキーでキーワードを管理。タブが閉じたら自動クリア。

async function nudge(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { action: 'rehighlight' });
  } catch (e) {
    try {
      await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
      await chrome.scripting.insertCSS({ target: { tabId }, files: ['content.css'] });
    } catch (e2) {
      // chrome:// pages etc.
    }
  }
}

// content.jsからのgetTabIdリクエストに応答
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTabId') {
    sendResponse({ tabId: sender.tab?.id });
  }
  return false;
});

// タブが閉じたらそのタブのキーワードをstorageから削除
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const key = `automarker_tab_${tabId}`;
  await chrome.storage.local.remove(key);
});

// ナビゲーション完了時にnudge
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;
  const data = await chrome.storage.local.get(['automarker_settings']);
  if (data.automarker_settings?.enabled === false) return;
  nudge(tabId);
});

// 設定・色変更時にアクティブタブをnudge
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace !== 'local') return;
  if (!changes.automarker_settings && !changes.automarker_colors) return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) nudge(tab.id);
});
