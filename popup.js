// AutoMarker Aria v5.5 - Pre-Search Intelligence

class AutoMarkerPopup {
  constructor() {
    this.apiConfig = null;
    this.negatives = [];
    this.init();
  }

  async init() {
    this.cacheElements();
    this.bindEvents();
    await this.loadSettings();
    await this.checkApiConfig();
    this.applyHighlights();
  }

  cacheElements() {
    this.slots = document.querySelectorAll('.slot');
    this.masterToggle = document.getElementById('masterToggle');
    this.showMoreBtn = document.getElementById('showMore');
    this.extendedSlots = document.querySelector('.slots.extended');
    this.clearAllBtn = document.getElementById('clearAll');
    this.openSettingsBtn = document.getElementById('openSettings');
    this.matchCount = document.getElementById('matchCount');

    // AI Build elements
    this.themeInput = document.getElementById('themeInput');
    this.aiBuildBtn = document.getElementById('aiBuildBtn');
    this.negativesSection = document.getElementById('negativesSection');
    this.negativesList = document.getElementById('negativesList');
  }

  bindEvents() {
    // Master toggle
    this.masterToggle.addEventListener('change', () => {
      this.saveSettings();
      this.applyHighlights();
    });

    // Show more
    this.showMoreBtn.addEventListener('click', () => {
      this.extendedSlots.classList.toggle('hidden');
      this.showMoreBtn.classList.toggle('active');
      this.showMoreBtn.textContent = this.extendedSlots.classList.contains('hidden')
        ? '+ More (L3-L4)'
        : '− Less';
    });

    // Clear all
    this.clearAllBtn.addEventListener('click', () => this.clearAll());

    // Settings
    this.openSettingsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });

    // AI Build
    this.aiBuildBtn.addEventListener('click', () => this.aiBuild());

    // Enter key in theme input
    this.themeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !this.aiBuildBtn.disabled) {
        this.aiBuild();
      }
    });

    // Slot events
    this.slots.forEach(slot => {
      const colorPicker = slot.querySelector('.color-picker');
      const keywordInput = slot.querySelector('.keyword-input');
      const clearBtn = slot.querySelector('.clear-btn');

      let timer;
      keywordInput.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.saveSettings();
          this.applyHighlights();
        }, 300);
      });

      colorPicker.addEventListener('change', () => {
        this.saveSettings();
        this.applyHighlights();
      });

      clearBtn.addEventListener('click', () => {
        keywordInput.value = '';
        this.saveSettings();
        this.applyHighlights();
      });
    });
  }

  clearAll() {
    this.slots.forEach(slot => {
      slot.querySelector('.keyword-input').value = '';
    });
    this.themeInput.value = '';
    this.negatives = [];
    this.negativesSection.classList.add('hidden');
    this.saveSettings();
    this.applyHighlights();
  }

  async loadSettings() {
    const data = await chrome.storage.local.get(['automarker_settings']);
    const settings = data.automarker_settings || {};

    if (settings.slots) {
      settings.slots.forEach((slotData, index) => {
        if (this.slots[index] && slotData) {
          this.slots[index].querySelector('.keyword-input').value = slotData.keyword || '';
          if (slotData.color) {
            this.slots[index].querySelector('.color-picker').value = slotData.color;
          }
        }
      });
    }

    if (settings.enabled !== undefined) {
      this.masterToggle.checked = settings.enabled;
    }

    if (settings.negatives?.length > 0) {
      this.negatives = settings.negatives;
      this.displayNegatives();
    }
  }

  async saveSettings() {
    const slots = [];
    this.slots.forEach(slot => {
      slots.push({
        keyword: slot.querySelector('.keyword-input').value,
        color: slot.querySelector('.color-picker').value
      });
    });

    await chrome.storage.local.set({
      automarker_settings: {
        slots,
        enabled: this.masterToggle.checked,
        negatives: this.negatives
      }
    });
  }

  async checkApiConfig() {
    const data = await chrome.storage.local.get(['automarker_api']);
    this.apiConfig = data.automarker_api;

    if (this.apiConfig?.apiKey) {
      this.aiBuildBtn.disabled = false;
      this.aiBuildBtn.title = `Using ${this.apiConfig.provider}`;
    } else {
      this.aiBuildBtn.title = 'Configure API in Settings';
    }
  }

  async applyHighlights() {
    const slots = [];
    this.slots.forEach(slot => {
      const keyword = slot.querySelector('.keyword-input').value.trim();
      const color = slot.querySelector('.color-picker').value;
      if (keyword) {
        slots.push({ keyword, color });
      }
    });

    const enabled = this.masterToggle.checked;

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'highlight',
          data: { slots, enabled, negatives: this.negatives }
        });

        if (response?.matchCount !== undefined) {
          this.matchCount.textContent = `${response.matchCount} matches`;
        }
      }
    } catch (e) {
      this.matchCount.textContent = 'Ready';
    }
  }

  // === AI Build: Pre-Search Intelligence ===
  async aiBuild() {
    const theme = this.themeInput.value.trim();
    if (!theme || !this.apiConfig?.apiKey) return;

    // Start loading
    this.aiBuildBtn.classList.add('loading');
    this.aiBuildBtn.disabled = true;
    this.matchCount.textContent = 'Building strategy...';

    try {
      const result = await this.callHaikuForStrategy(theme);
      console.log('AI Build result:', result);

      if (result) {
        // 1. Fill slots immediately
        this.fillSlotsFromAI(result.slots);

        // 2. Store negatives
        if (result.negatives?.length > 0) {
          this.negatives = result.negatives;
          this.displayNegatives();
        }

        // 3. Save settings
        await this.saveSettings();

        // 4. Open search tab IMMEDIATELY (speed first!)
        if (result.query) {
          console.log('Opening search with query:', result.query);
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(result.query)}`;
          chrome.tabs.create({ url: searchUrl });
        } else {
          console.warn('No query in AI result');
        }

        this.matchCount.textContent = 'Strategy deployed!';
      } else {
        console.error('AI result is null');
        this.matchCount.textContent = 'No result from AI';
      }
    } catch (e) {
      console.error('AI Build failed:', e);
      this.matchCount.textContent = 'Build failed';
    } finally {
      this.aiBuildBtn.classList.remove('loading');
      this.aiBuildBtn.disabled = false;
    }
  }

  async callHaikuForStrategy(theme) {
    const { provider, apiKey, model } = this.apiConfig;

    const prompt = `You are a research strategist. Given the theme "${theme}", create a search strategy.

Return ONLY valid JSON (no markdown, no explanation):
{
  "query": "optimized Google search query using natural keywords",
  "slots": {
    "level1": ["core_keyword1", "core_keyword2"],
    "level2": ["evidence_keyword1", "evidence_keyword2"],
    "level3": ["context_keyword1", "context_keyword2"],
    "level4": ["related_keyword1", "related_keyword2"]
  },
  "negatives": ["noise_word1", "noise_word2", "noise_word3"]
}

Rules:
- query: Natural keyword combination. DO NOT use "quotes" for exact phrases. DO use -minus to exclude noise (e.g., -sale -buy -price -amazon -shop)
- level1: Core concepts that directly answer the query
- level2: Evidence, data, methodology terms
- level3: Technical/domain terms for context
- level4: Related concepts for broader understanding
- negatives: Words that indicate low-quality/commercial content to visually de-emphasize`;

    try {
      if (provider === 'claude') {
        return await this.callClaudeForStrategy(apiKey, model, prompt);
      } else if (provider === 'openai') {
        return await this.callOpenAIForStrategy(apiKey, model, prompt);
      } else if (provider === 'gemini') {
        return await this.callGeminiForStrategy(apiKey, model, prompt);
      }
    } catch (e) {
      console.error('API call failed:', e);
      return null;
    }
  }

  async callClaudeForStrategy(apiKey, model, prompt) {
    console.log('Calling Claude with model:', model || 'claude-3-5-haiku-20241022');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-haiku-20241022',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    console.log('Claude raw response:', data);
    const text = data.content?.[0]?.text || '{}';
    console.log('Claude text:', text);
    return this.parseAIResponse(text);
  }

  async callOpenAIForStrategy(apiKey, model, prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500
      })
    });
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    return this.parseAIResponse(text);
  }

  async callGeminiForStrategy(apiKey, model, prompt) {
    const modelName = model || 'gemini-2.0-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return this.parseAIResponse(text);
  }

  parseAIResponse(text) {
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }
    return null;
  }

  fillSlotsFromAI(slotsData) {
    if (!slotsData) return;

    const allKeywords = [
      ...(slotsData.level1 || []),
      ...(slotsData.level2 || []),
      ...(slotsData.level3 || []),
      ...(slotsData.level4 || [])
    ];

    // Show extended slots if we have more than 4 keywords
    if (allKeywords.length > 4 && this.extendedSlots.classList.contains('hidden')) {
      this.extendedSlots.classList.remove('hidden');
      this.showMoreBtn.classList.add('active');
      this.showMoreBtn.textContent = '− Less';
    }

    // Fill slots
    allKeywords.slice(0, 8).forEach((keyword, index) => {
      if (this.slots[index]) {
        this.slots[index].querySelector('.keyword-input').value = keyword;
      }
    });
  }

  displayNegatives() {
    if (this.negatives.length === 0) {
      this.negativesSection.classList.add('hidden');
      return;
    }

    this.negativesSection.classList.remove('hidden');
    this.negativesList.innerHTML = this.negatives
      .map(word => `<span class="negative-word">${word}</span>`)
      .join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AutoMarkerPopup();
});
