// AutoMarker Aria - popup (highlight-only edition)
// AI Build / presets / per-word inputs removed. Only: ON-OFF toggle + L1-L8 colors + COLOR RESET.

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

class Popup {
  constructor() {
    this.masterToggle = document.getElementById('masterToggle');
    this.manualKeywords = document.getElementById('manualKeywords');
    this.manualClear = document.getElementById('manualClear');
    this.colorPickers = Array.from(document.querySelectorAll('.color-picker'));
    this.colorReset = document.getElementById('colorReset');
    this.colors = DEFAULT_COLORS.slice();
    this.tabId = null;
    this.bindEvents();
    this.load();
  }

  bindEvents() {
    // Master ON/OFF
    this.masterToggle.addEventListener('change', () => this.saveSettings());

    // 手動キーワード入力（Enterまたはfocusout時に反映）
    this.manualKeywords.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); this.saveManualKeywords(); }
    });
    this.manualKeywords.addEventListener('blur', () => this.saveManualKeywords());
    this.manualClear.addEventListener('click', () => {
      this.manualKeywords.value = '';
      this.saveManualKeywords();
    });

    // Color pickers (L1-L8)
    this.colorPickers.forEach((picker, index) => {
      picker.addEventListener('input', () => {
        this.colors[index] = picker.value;
        this.saveColors();
      });
    });

    // COLOR RESET -> restore default L1-L8 palette
    this.colorReset.addEventListener('click', () => {
      this.colors = DEFAULT_COLORS.slice();
      this.colorPickers.forEach((picker, i) => { picker.value = this.colors[i]; });
      this.saveColors();
    });
  }

  async load() {
    try {
      // 現在のタブIDを取得
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.tabId = tab?.id || null;
      const manualKey = this.tabId ? `automarker_manual_tab_${this.tabId}` : 'automarker_manual_keywords';

      const data = await chrome.storage.local.get(['automarker_settings', 'automarker_colors', manualKey]);
      const settings = data.automarker_settings || {};

      // Master enable (default ON)
      this.masterToggle.checked = settings.enabled !== false;

      // 手動キーワード復元（タブ別）
      const manual = data[manualKey] || [];
      this.manualKeywords.value = manual.join(' ');

      // Colors (fallback to defaults per-slot)
      const stored = Array.isArray(data.automarker_colors) ? data.automarker_colors : [];
      this.colors = DEFAULT_COLORS.map((def, i) => stored[i] || def);
      this.colorPickers.forEach((picker, i) => { picker.value = this.colors[i]; });
    } catch (e) {
      // ignore
    }
  }

  async saveManualKeywords() {
    const words = this.manualKeywords.value.trim().split(/\s+/).filter(Boolean);
    const manualKey = this.tabId ? `automarker_manual_tab_${this.tabId}` : 'automarker_manual_keywords';
    try {
      await chrome.storage.local.set({ [manualKey]: words });
      if (this.tabId) chrome.tabs.sendMessage(this.tabId, { action: 'rehighlight' }).catch(() => {});
    } catch (e) {
      // ignore
    }
  }

  async saveSettings() {
    const enabled = this.masterToggle.checked;
    try {
      const data = await chrome.storage.local.get(['automarker_settings']);
      const settings = data.automarker_settings || {};
      settings.enabled = enabled;
      settings.autoHighlight = enabled;
      await chrome.storage.local.set({ automarker_settings: settings });
    } catch (e) {
      // ignore
    }
  }

  async saveColors() {
    try {
      await chrome.storage.local.set({ automarker_colors: this.colors });
    } catch (e) {
      // ignore
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new Popup());
