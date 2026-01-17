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

// Default presets (same as popup.js PRESETS)
const DEFAULT_PRESETS = {
  default: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

NOTE: User's theme is auto-placed in L1a. Generate 7 keywords for L1b-L4b.

keywords (7 slots):
- L1b: Core synonym of theme
- L2a-L2b: Evidence — Data, research, proof that validates quality content.
- L3a-L3b: Signals — Quality indicators (white paper, guide, analysis). For deep research.
- L4a-L4b: Related — Adjacent concepts. For comprehensive exploration.

negatives (5): Think SPECIFICALLY about this theme. What pages appear in search but provide NO real value?
- Commercial noise: shopping, affiliate, sales pages
- Content farms: thin SEO articles, clickbait, AI-generated filler
- Off-topic traps: terms that sound related but lead to different domains
- Outdated: old version numbers, deprecated terms
Generate 5 negatives that a domain expert would know to avoid for THIS specific theme.

CRITICAL: Negatives must NOT overlap with theme or keywords. Never negate what you're searching FOR.

No minus signs. No markdown. JSON only.`,

  academic: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

GOAL: Find primary sources, peer-reviewed papers, official reports. Avoid secondary sources and summaries.

NOTE: User's theme is auto-placed in L1a. Generate 7 keywords for L1b-L4b.

keywords (7 slots):
- L1b: Academic synonym (論文, research, study)
- L2a-L2b: Evidence — Empirical proof (data, findings, results, 実験)
- L3a-L3b: Signals — Quality markers (peer-reviewed, journal, 学会, .edu, .gov)
- L4a-L4b: Related — Adjacent research fields

negatives (5): Think about what pollutes academic searches for THIS theme:
- Popular science rewrites that oversimplify
- Student summaries and course notes
- News articles citing papers without depth
- Blog posts misinterpreting research
- Predatory journal indicators for this field
Generate 5 negatives specific to academic noise in this domain.

CRITICAL: Negatives must NOT overlap with theme or keywords. Never negate what you're searching FOR.

No minus signs. No markdown. JSON only.`,

  technical: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

GOAL: Find official docs, GitHub issues, Stack Overflow deep discussions. Avoid beginner tutorials and outdated content.

NOTE: User's theme is auto-placed in L1a. Generate 7 keywords for L1b-L4b.

keywords (7 slots):
- L1b: Technical term (API, implementation, 実装)
- L2a-L2b: Evidence — Implementation data (example, config, error, debug)
- L3a-L3b: Signals — Quality sources (official docs, GitHub, Stack Overflow)
- L4a-L4b: Related — Alternative libraries, related tools

negatives (5): Think about technical search pollution for THIS specific technology:
- Outdated version numbers or deprecated APIs
- Beginner tutorial markers for this stack
- Copy-paste code sites that lack explanation
- Marketing pages disguised as documentation
- Common misconceptions or anti-patterns in this domain
Generate 5 negatives that an experienced developer would filter out.

CRITICAL: Negatives must NOT overlap with theme or keywords. Never negate what you're searching FOR.

No minus signs. No markdown. JSON only.`,

  trends: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

GOAL: Find fresh market analysis, forecasts, roadmaps. Prioritize 2025/2026 content.

NOTE: User's theme is auto-placed in L1a. Generate 7 keywords for L1b-L4b.

keywords (7 slots):
- L1b: Year indicator (2025, 2026, latest)
- L2a-L2b: Evidence — Trend data (forecast, 予測, growth, market size)
- L3a-L3b: Signals — Quality sources (Gartner, IDC, analyst report, 調査レポート)
- L4a-L4b: Related — Adjacent markets, emerging players

negatives (5): Think about what makes trend research outdated or misleading for THIS theme:
- Specific old years when this field changed significantly
- Defunct companies or products in this space
- Hype terms that peaked and faded
- Clickbait prediction formats common in this industry
- News rehashes vs original analysis markers
Generate 5 negatives to filter stale or superficial trend content.

CRITICAL: Negatives must NOT overlap with theme or keywords. Never negate what you're searching FOR.

No minus signs. No markdown. JSON only.`,

  comparison: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

GOAL: Find honest comparisons, limitations, real user complaints. Avoid affiliate marketing and promotional content.

NOTE: User's theme is auto-placed in L1a. Generate 7 keywords for L1b-L4b.

keywords (7 slots):
- L1b: Comparison term (vs, 比較, alternative)
- L2a-L2b: Evidence — Honest assessment (limitation, デメリット, cons, 欠点)
- L3a-L3b: Signals — Quality reviews (Reddit, 本音, real user, long-term review)
- L4a-L4b: Related — Competitors, alternatives, migration

negatives (5): Think about what makes comparison content biased or useless for THIS product/topic:
- Affiliate disclosure patterns in this niche
- Paid review indicators specific to this category
- Fake review patterns common for this type of product
- Marketing buzzwords this industry overuses
- Superficial "top 10" formats that lack depth
Generate 5 negatives to find genuinely honest comparisons.

CRITICAL: Negatives must NOT overlap with theme or keywords. Never negate what you're searching FOR.

No minus signs. No markdown. JSON only.`,

  concepts: `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["L1b","L2a","L2b","L3a","L3b","L4a","L4b"],"negatives":["n1","n2","n3","n4","n5"]}

GOAL: Understand fundamentals accurately. Find clear explanations with diagrams. Avoid SEO-optimized shallow content.

NOTE: User's theme is auto-placed in L1a. Generate 7 keywords for L1b-L4b.

keywords (7 slots):
- L1b: Definition term (とは, what is, 意味, definition)
- L2a-L2b: Evidence — Explanatory content (仕組み, how it works, 図解, diagram)
- L3a-L3b: Signals — Quality sources (Wikipedia, 公式, official, textbook)
- L4a-L4b: Related — Related concepts, prerequisites, next topics

negatives (5): Think about what makes educational content shallow for THIS concept:
- SEO filler phrases common when explaining this topic
- Oversimplification markers that lose important nuance
- Common misconceptions people spread about this
- Tangentially related terms that lead to different concepts
- Content farm patterns in this educational niche
Generate 5 negatives to find deep, accurate explanations.

CRITICAL: Negatives must NOT overlap with theme or keywords. Never negate what you're searching FOR.

No minus signs. No markdown. JSON only.`
};

class OptionsPage {
  constructor() {
    this.provider = null;
    this.currentPreset = 'default';
    this.customPresets = {}; // User's customized presets
    this.init();
  }

  async init() {
    this.cacheElements();
    this.bindEvents();
    await this.loadSettings();
  }

  cacheElements() {
    this.providerCards = document.querySelectorAll('.provider-card');
    this.apiKeyInput = document.getElementById('apiKey');
    this.modelSelect = document.getElementById('model');
    this.presetSelect = document.getElementById('presetSelect');
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
    this.presetSelect.addEventListener('change', () => {
      this.saveCurrentPrompt(); // Save current before switching
      this.currentPreset = this.presetSelect.value;
      this.loadPresetPrompt();
    });

    // Auto-save prompt on change (debounced)
    let saveTimeout;
    this.customPromptInput.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        this.saveCurrentPrompt();
      }, 500);
    });

    // Save API settings
    this.saveBtn.addEventListener('click', () => this.saveApiSettings());

    // Clear
    this.clearBtn.addEventListener('click', () => this.clear());

    // Reset current preset
    this.resetPromptBtn.addEventListener('click', () => this.resetCurrentPreset());
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
    const data = await chrome.storage.local.get(['automarker_api', 'automarker_presets']);
    const config = data.automarker_api;
    this.customPresets = data.automarker_presets || {};

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

    // Load current preset prompt
    this.loadPresetPrompt();
  }

  loadPresetPrompt() {
    // Use custom preset if exists, otherwise use default
    const prompt = this.customPresets[this.currentPreset] || DEFAULT_PRESETS[this.currentPreset];
    this.customPromptInput.value = prompt;
  }

  async saveCurrentPrompt() {
    const currentPrompt = this.customPromptInput.value.trim();
    const defaultPrompt = DEFAULT_PRESETS[this.currentPreset];

    if (currentPrompt === defaultPrompt) {
      // If same as default, remove custom entry
      delete this.customPresets[this.currentPreset];
    } else {
      // Save custom prompt
      this.customPresets[this.currentPreset] = currentPrompt;
    }

    await chrome.storage.local.set({ automarker_presets: this.customPresets });
  }

  async saveApiSettings() {
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

    // Also save current prompt
    await this.saveCurrentPrompt();

    this.showStatus('Settings saved!', 'success');
  }

  async clear() {
    await chrome.storage.local.remove(['automarker_api', 'automarker_presets']);

    this.provider = null;
    this.apiKeyInput.value = '';
    this.modelSelect.innerHTML = '<option value="">Select a model</option>';
    this.customPresets = {};
    this.currentPreset = 'default';
    this.presetSelect.value = 'default';
    this.loadPresetPrompt();

    this.providerCards.forEach(card => {
      card.classList.remove('selected');
      card.querySelector('input').checked = false;
    });

    this.showStatus('Settings cleared', 'success');
  }

  async resetCurrentPreset() {
    // Remove custom prompt for current preset
    delete this.customPresets[this.currentPreset];
    await chrome.storage.local.set({ automarker_presets: this.customPresets });

    // Reload default
    this.customPromptInput.value = DEFAULT_PRESETS[this.currentPreset];
    this.showStatus(`"${this.currentPreset}" reset to default`, 'success');
  }

  showStatus(message, type) {
    this.status.textContent = message;
    this.status.className = 'status ' + type;

    setTimeout(() => {
      this.status.className = 'status';
    }, 3000);
  }
}

// Export for popup.js
window.DEFAULT_PRESETS = DEFAULT_PRESETS;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new OptionsPage();
});
