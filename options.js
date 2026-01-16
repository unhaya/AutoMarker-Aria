// AutoMarker Aria - Options Page

const MODELS = {
  claude: [
    { value: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (Fast)' },
    { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
    { value: 'claude-opus-4-20250514', label: 'Claude Opus 4' }
  ],
  openai: [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'o1', label: 'o1' },
    { value: 'o1-mini', label: 'o1 Mini' }
  ],
  gemini: [
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Fast)' },
    { value: 'gemini-2.0-pro', label: 'Gemini 2.0 Pro' },
    { value: 'gemini-2.0-flash-thinking', label: 'Gemini 2.0 Flash Thinking' }
  ]
};

const DEFAULT_PROMPT = `You are an expert research strategist. Given the theme "\${theme}", create a precision search strategy.

LANGUAGE RULE: Detect the theme's language and generate ALL output in that SAME language.

Return ONLY valid JSON:
{
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5", "kw6", "kw7", "kw8"],
  "negatives": ["exclude1", "exclude2", "exclude3", "exclude4", "exclude5"]
}

KEYWORDS (8 total) - Choose words that ACTUALLY APPEAR in search results:
- [0-1]: Main theme words + synonym (the words user typed + alternatives)
- [2-3]: Practical terms people use when discussing this topic
- [4-5]: Quality signals that appear in good content
- [6-7]: Related concepts that expand the search

NOTE: If theme contains multiple words, treat them as combined search intent.
IMPORTANT: Avoid overly academic terms that rarely appear in web content.

NEGATIVES (5 required) - THINK DEEPLY about this specific theme:

Step 1: What does someone searching "\${theme}" ACTUALLY want?
- Academic research? Technical documentation? Professional insights?

Step 2: What SPECIFIC noise will pollute "\${theme}" search results?
- Product categories that dominate results (furniture, gadgets, tools)
- Adjacent but irrelevant fields that share terminology
- Career/job content (job listings, salary, interview)
- Tutorial/beginner content if user wants advanced info
- Specific platforms that add noise (YouTube, TikTok, Pinterest)

ALWAYS INCLUDE these EC/shopping site exclusions:
- Japanese: -Amazon -楽天 -Yahoo!ショッピング -価格.com -通販
- English: -Amazon -eBay -Walmart -shop -buy

The goal: Remove EC noise + predict what SPECIFICALLY pollutes "\${theme}" results.`;

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
