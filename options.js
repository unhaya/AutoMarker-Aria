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

const DEFAULT_PROMPT = `Theme: "\${theme}"

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

No minus signs. No markdown. JSON only.`;

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

    // Save
    this.saveBtn.addEventListener('click', () => this.save());

    // Clear
    this.clearBtn.addEventListener('click', () => this.clear());

    // Reset prompt
    this.resetPromptBtn.addEventListener('click', () => this.resetPrompt());
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
    this.customPromptInput.value = customPrompt || DEFAULT_PROMPT;
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

    this.showStatus('Settings cleared', 'success');
  }

  resetPrompt() {
    this.customPromptInput.value = DEFAULT_PROMPT;
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
