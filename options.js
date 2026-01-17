// AutoMarker Aria - Options Page

const MODELS = {
  claude: [
    { value: 'claude-haiku-4-5-20251015', label: 'Claude Haiku 4.5 (Fast)' },
    { value: 'claude-sonnet-4-5-20250514', label: 'Claude Sonnet 4.5' },
    { value: 'claude-opus-4-5-20251101', label: 'Claude Opus 4.5' }
  ],
  openai: [
    { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini (Fast)' },
    { value: 'gpt-4.1', label: 'GPT-4.1' },
    { value: 'gpt-5', label: 'GPT-5' },
    { value: 'gpt-5.1', label: 'GPT-5.1' }
  ],
  gemini: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Fast)' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-3-flash', label: 'Gemini 3 Flash (Preview)' },
    { value: 'gemini-3-pro', label: 'Gemini 3 Pro (Preview)' }
  ]
};

const DEFAULT_PROMPT = `Theme: "\${theme}"

Output language: SAME as theme.

JSON only:
{"keywords":["k1","k2","k3","k4","k5","k6","k7","k8"],"negatives":["n1","n2","n3","n4","n5"]}

keywords (8): Words that appear on QUALITY pages. Core terms + quality signals (white paper, research, guide). If time-sensitive, add year.

negatives (5): Words that appear on JUNK pages. Always include: Amazon, 楽天, shop, buy, 通販. Add domain-specific noise.

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
