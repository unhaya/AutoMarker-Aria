// AutoMarker Aria - Options Page

const MODELS = {
  claude: [
    { value: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku (Fast)' },
    { value: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5' },
    { value: 'claude-opus-4-5-20251101', label: 'Claude Opus 4.5' }
  ],
  openai: [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4.1-mini-2025-04-14', label: 'GPT-4.1 Mini' },
    { value: 'gpt-4.1-2025-04-14', label: 'GPT-4.1' }
  ],
  gemini: [
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Fast)' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' }
  ]
};

const PRESETS = {
  default: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1a","L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

keywords (8 slots, priority order):
- L1 (0-1): Core — The theme itself and its synonym. MOST IMPORTANT.
- L2 (2-3): Evidence — Data, research, proof that validates quality content.
- L3 (4-5): Signals — Quality indicators (white paper, guide, analysis). For deep research.
- L4 (6-7): Related — Adjacent concepts. For comprehensive exploration.

Most users only see L1+L2 (4 keywords). L3+L4 appear when expanded for complex research.

negatives (5): Words on JUNK pages. Always: Amazon, 楽天, shop, buy, 通販. Add domain noise.

No minus signs. No markdown. JSON only.`,

  academic: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1a","L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

GOAL: Find primary sources, peer-reviewed papers, official reports. Avoid "matome" sites and shallow summaries.

keywords (8 slots):
- L1 (0-1): Core — Theme + academic synonym (論文, research, study)
- L2 (2-3): Evidence — Empirical proof (data, findings, results, 実験)
- L3 (4-5): Signals — Quality markers (peer-reviewed, journal, 学会, .edu, .gov)
- L4 (6-7): Related — Adjacent research fields

negatives (5): まとめ, NAVERまとめ, アフィリエイト, PR, sponsored, blog

No minus signs. No markdown. JSON only.`,

  technical: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1a","L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

GOAL: Find official docs, GitHub issues, Stack Overflow deep discussions. Avoid outdated tutorials.

keywords (8 slots):
- L1 (0-1): Core — Theme + technical term (API, implementation, 実装)
- L2 (2-3): Evidence — Implementation data (example, config, error, debug)
- L3 (4-5): Signals — Quality sources (official docs, GitHub, Stack Overflow)
- L4 (6-7): Related — Alternative libraries, related tools

negatives (5): Qiita初心者, 入門, tutorial 2020, outdated, deprecated

No minus signs. No markdown. JSON only.`,

  trends: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1a","L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

GOAL: Find fresh market analysis, forecasts, roadmaps. Prioritize 2025/2026 content.

keywords (8 slots):
- L1 (0-1): Core — Theme + year (2025, 2026, latest)
- L2 (2-3): Evidence — Trend data (forecast, 予測, growth, market size)
- L3 (4-5): Signals — Quality sources (Gartner, IDC, analyst report, 調査レポート)
- L4 (6-7): Related — Adjacent markets, emerging players

negatives (5): 2020, 2021, 2022, outdated, 古い

No minus signs. No markdown. JSON only.`,

  comparison: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1a","L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

GOAL: Find honest comparisons, limitations, real user complaints. Avoid affiliate "best X" lists.

keywords (8 slots):
- L1 (0-1): Core — Theme + comparison term (vs, 比較, alternative)
- L2 (2-3): Evidence — Honest assessment (limitation, デメリット, cons, 欠点)
- L3 (4-5): Signals — Quality reviews (Reddit, 本音, real user, long-term review)
- L4 (6-7): Related — Competitors, alternatives, migration

negatives (5): おすすめ, best, ランキング, affiliate, PR

No minus signs. No markdown. JSON only.`,

  concepts: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1a","L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

GOAL: Understand fundamentals accurately. Find clear explanations with diagrams. Avoid SEO-optimized shallow content.

keywords (8 slots):
- L1 (0-1): Core — Theme + definition (とは, what is, 意味, definition)
- L2 (2-3): Evidence — Explanatory content (仕組み, how it works, 図解, diagram)
- L3 (4-5): Signals — Quality sources (Wikipedia, 公式, official, textbook)
- L4 (6-7): Related — Related concepts, prerequisites, next topics

negatives (5): いかがでしたか, まとめサイト, コピペ, 3分でわかる, 簡単

No minus signs. No markdown. JSON only.`
};

const DEFAULT_PROMPT = PRESETS.default;

class OptionsPage {
  constructor() {
    this.provider = null;
    this.init();
  }

  async init() {
    this.cacheElements();
    this.bindEvents();
    await this.loadSettings();
  }

  cacheElements() {
    this.providerCards = document.querySelectorAll('.provider-card');
    this.presetCards = document.querySelectorAll('.preset-card');
    this.apiKeyInput = document.getElementById('apiKey');
    this.modelSelect = document.getElementById('model');
    this.customPromptInput = document.getElementById('customPrompt');
    this.saveBtn = document.getElementById('saveBtn');
    this.clearBtn = document.getElementById('clearBtn');
    this.resetPromptBtn = document.getElementById('resetPromptBtn');
    this.status = document.getElementById('status');
  }

  bindEvents() {
    // Provider selection
    this.providerCards.forEach(card => {
      card.addEventListener('click', () => {
        this.selectProvider(card.dataset.provider);
      });
    });

    // Preset selection
    this.presetCards.forEach(card => {
      card.addEventListener('click', () => {
        this.selectPreset(card.dataset.preset);
      });
    });

    // Save
    this.saveBtn.addEventListener('click', () => this.save());

    // Clear
    this.clearBtn.addEventListener('click', () => this.clear());

    // Reset prompt
    this.resetPromptBtn.addEventListener('click', () => this.resetPrompt());
  }

  selectPreset(presetName) {
    // Update UI
    this.presetCards.forEach(card => {
      card.classList.toggle('selected', card.dataset.preset === presetName);
      card.querySelector('input').checked = card.dataset.preset === presetName;
    });

    // Update prompt
    if (PRESETS[presetName]) {
      this.customPromptInput.value = PRESETS[presetName];
    }
  }

  selectProvider(provider) {
    this.provider = provider;

    // Update UI
    this.providerCards.forEach(card => {
      card.classList.toggle('selected', card.dataset.provider === provider);
      card.querySelector('input').checked = card.dataset.provider === provider;
    });

    // Update model options
    this.updateModels(provider);
  }

  updateModels(provider) {
    const models = MODELS[provider] || [];
    this.modelSelect.innerHTML = '<option value="">Select a model</option>';

    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.value;
      option.textContent = model.label;
      this.modelSelect.appendChild(option);
    });

    // Select first model by default
    if (models.length > 0) {
      this.modelSelect.value = models[0].value;
    }
  }

  async loadSettings() {
    const data = await chrome.storage.local.get(['automarker_api', 'automarker_prompt']);
    const config = data.automarker_api;
    const customPrompt = data.automarker_prompt;

    if (config) {
      if (config.provider) {
        this.selectProvider(config.provider);
      }
      if (config.apiKey) {
        this.apiKeyInput.value = config.apiKey;
      }
      if (config.model) {
        this.modelSelect.value = config.model;
      }
    }

    // Load custom prompt or show default
    const promptToLoad = customPrompt || DEFAULT_PROMPT;
    this.customPromptInput.value = promptToLoad;

    // Check if current prompt matches a preset and select it
    for (const [presetName, presetPrompt] of Object.entries(PRESETS)) {
      if (promptToLoad === presetPrompt) {
        this.presetCards.forEach(card => {
          card.classList.toggle('selected', card.dataset.preset === presetName);
          card.querySelector('input').checked = card.dataset.preset === presetName;
        });
        break;
      }
    }
  }

  async save() {
    const config = {
      provider: this.provider,
      apiKey: this.apiKeyInput.value.trim(),
      model: this.modelSelect.value
    };

    if (!config.provider) {
      this.showStatus('Please select an AI provider', 'error');
      return;
    }

    if (!config.apiKey) {
      this.showStatus('Please enter your API key', 'error');
      return;
    }

    // Save API config
    await chrome.storage.local.set({ automarker_api: config });

    // Save custom prompt (only if different from default)
    const customPrompt = this.customPromptInput.value.trim();
    if (customPrompt && customPrompt !== DEFAULT_PROMPT) {
      await chrome.storage.local.set({ automarker_prompt: customPrompt });
    } else {
      await chrome.storage.local.remove(['automarker_prompt']);
    }

    this.showStatus('Settings saved successfully!', 'success');
  }

  async clear() {
    await chrome.storage.local.remove(['automarker_api', 'automarker_prompt']);

    this.provider = null;
    this.apiKeyInput.value = '';
    this.modelSelect.innerHTML = '<option value="">Select a model</option>';
    this.customPromptInput.value = DEFAULT_PROMPT;

    this.providerCards.forEach(card => {
      card.classList.remove('selected');
      card.querySelector('input').checked = false;
    });

    // Reset preset to default
    this.presetCards.forEach(card => {
      card.classList.toggle('selected', card.dataset.preset === 'default');
      card.querySelector('input').checked = card.dataset.preset === 'default';
    });

    this.showStatus('Settings cleared', 'success');
  }

  resetPrompt() {
    this.customPromptInput.value = DEFAULT_PROMPT;
    // Reset preset to default
    this.presetCards.forEach(card => {
      card.classList.toggle('selected', card.dataset.preset === 'default');
      card.querySelector('input').checked = card.dataset.preset === 'default';
    });
    this.showStatus('Prompt reset to default', 'success');
  }

  showStatus(message, type) {
    this.status.textContent = message;
    this.status.className = 'status ' + type;

    setTimeout(() => {
      this.status.className = 'status';
    }, 3000);
  }
}

// Export default prompt for use in popup.js
window.DEFAULT_PROMPT = DEFAULT_PROMPT;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new OptionsPage();
});
