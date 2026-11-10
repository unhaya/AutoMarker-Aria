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

const DRAG_PX = 4;

// anchor の上（after=false）か下（after=true）へ from を移した時の、移動後の位置
function insertIndex(from, anchor, after) {
  const to = after ? anchor + 1 : anchor;
  return from < to ? to - 1 : to;
}

// 入れ替え（swap）ではなく割り込み。間の物は1つずつずれる
function moveItem(list, from, to) {
  const out = list.slice();
  const [item] = out.splice(from, 1);
  out.splice(to, 0, item);
  return out;
}

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

    this.bindReorder();

    // COLOR RESET -> restore default L1-L8 palette
    this.colorReset.addEventListener('click', () => {
      this.colors = DEFAULT_COLORS.slice();
      this.colorPickers.forEach((picker, i) => { picker.value = this.colors[i]; });
      this.saveColors();
    });
  }

  // カードをつかんで動かすと差し込み位置に隙間が開き、離すとそこへ割り込む（以下は1つずつずれる）。
  // L番号は位置に付くので、動くのは色だけ。DRAG_PX 動くまではクリック＝カラーピッカーのまま。
  bindReorder() {
    this.rows = Array.from(document.querySelectorAll('.color-row'));
    this.grid = document.querySelector('.color-grid');
    let drag = null;

    const clearSlot = () => {
      this.rows.forEach((r) => r.classList.remove('slot-above', 'slot-below'));
      drag.plan = null;
    };
    const markSlot = (plan) => {
      this.rows.forEach((r, i) => {
        if (i !== plan.anchor) r.classList.remove('slot-above', 'slot-below');
      });
      const row = this.rows[plan.anchor];
      row.classList.toggle('slot-below', plan.after);
      row.classList.toggle('slot-above', !plan.after);
      drag.plan = plan;
    };
    // 隙間で行の箱が伸びても、上下の判定は色の帯（ピッカー）の中央で測る
    const planAt = (x, y) => {
      const row = document.elementFromPoint(x, y)?.closest('.color-row');
      if (!row) return undefined;
      const anchor = this.rows.indexOf(row);
      if (anchor === drag.from) return undefined;
      const band = row.querySelector('.color-picker').getBoundingClientRect();
      return { anchor, after: y > band.top + band.height / 2 };
    };
    const moveGhost = (ev) => {
      drag.ghost.style.left = (ev.clientX - drag.grab.x) + 'px';
      drag.ghost.style.top = (ev.clientY - drag.grab.y) + 'px';
    };
    const start = (ev) => {
      const row = this.rows[drag.from];
      const r = row.getBoundingClientRect();
      drag.grab = { x: drag.x0 - r.left, y: drag.y0 - r.top };
      this.grid.style.setProperty('--slot-h', r.height + 'px');
      drag.ghost = row.cloneNode(true);
      drag.ghost.querySelector('.color-picker').value = this.colors[drag.from];
      drag.ghost.classList.add('drag-image');
      drag.ghost.style.width = r.width + 'px';
      document.body.appendChild(drag.ghost);
      row.classList.add('dragging');
      row.setPointerCapture(ev.pointerId);
      drag.active = true;
    };
    const finish = (drop) => {
      if (!drag) return;
      if (drag.active) {
        const plan = drag.plan;
        this.rows[drag.from].classList.remove('dragging');
        clearSlot();
        drag.ghost.remove();
        // ドラッグの後に来るクリックでピッカーが開かないように1回だけ潰す
        const swallow = (e) => { e.stopPropagation(); e.preventDefault(); };
        window.addEventListener('click', swallow, { capture: true, once: true });
        setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0);
        if (drop && plan) this.placeColor(drag.from, plan);
      }
      drag = null;
    };

    this.rows.forEach((row, i) => {
      row.addEventListener('pointerdown', (ev) => {
        if (ev.button !== 0) return;
        drag = { from: i, x0: ev.clientX, y0: ev.clientY, active: false, plan: null };
      });
      row.addEventListener('pointermove', (ev) => {
        if (!drag || drag.from !== i) return;
        if (!(ev.buttons & 1)) { finish(false); return; }
        if (!drag.active) {
          if (Math.hypot(ev.clientX - drag.x0, ev.clientY - drag.y0) < DRAG_PX) return;
          start(ev);
        }
        moveGhost(ev);
        const plan = planAt(ev.clientX, ev.clientY);
        if (plan) markSlot(plan);
        else if (plan === undefined && !this.grid.contains(document.elementFromPoint(ev.clientX, ev.clientY))) clearSlot();
      });
      row.addEventListener('pointerup', () => finish(true));
      row.addEventListener('pointercancel', () => finish(false));
      row.addEventListener('lostpointercapture', () => finish(false));
    });
  }

  placeColor(from, { anchor, after }) {
    const to = insertIndex(from, anchor, after);
    if (to === from) return;
    this.colors = moveItem(this.colors, from, to);
    this.colorPickers.forEach((picker, i) => { picker.value = this.colors[i]; });
    this.saveColors();
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
