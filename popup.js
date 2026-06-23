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
    this.colorPickers = Array.from(document.querySelectorAll('.color-picker'));
    this.colorReset = document.getElementById('colorReset');
    this.matchCount = document.getElementById('matchCount');

    this.colors = DEFAULT_COLORS.slice();

    this.bindEvents();
    this.load();
  }

  bindEvents() {
    // Master ON/OFF
    this.masterToggle.addEventListener('change', () => this.saveSettings());

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
      this.setStatus('Colors reset');
    });
  }

  async load() {
    try {
      const data = await chrome.storage.local.get(['automarker_settings', 'automarker_colors']);
      const settings = data.automarker_settings || {};

      // Master enable (default ON)
      this.masterToggle.checked = settings.enabled !== false;

      // Colors (fallback to defaults per-slot)
      const stored = Array.isArray(data.automarker_colors) ? data.automarker_colors : [];
      this.colors = DEFAULT_COLORS.map((def, i) => stored[i] || def);
      this.colorPickers.forEach((picker, i) => { picker.value = this.colors[i]; });

      this.setStatus(this.masterToggle.checked ? 'On' : 'Off');
    } catch (e) {
      this.setStatus('Ready');
    }
  }

  async saveSettings() {
    const enabled = this.masterToggle.checked;
    try {
      const data = await chrome.storage.local.get(['automarker_settings']);
      const settings = data.automarker_settings || {};
      settings.enabled = enabled;
      // auto-highlight follows the master toggle in this edition
      settings.autoHighlight = enabled;
      await chrome.storage.local.set({ automarker_settings: settings });
      this.setStatus(enabled ? 'On' : 'Off');
    } catch (e) {
      this.setStatus('Error');
    }
  }

  async saveColors() {
    try {
      await chrome.storage.local.set({ automarker_colors: this.colors });
    } catch (e) {
      this.setStatus('Error');
    }
  }

  setStatus(text) {
    if (this.matchCount) this.matchCount.textContent = text;
  }
}

document.addEventListener('DOMContentLoaded', () => new Popup());
