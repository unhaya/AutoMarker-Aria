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
    this.useNegativesInSearch = document.getElementById('useNegativesInSearch');
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

    // Negatives toggle
    this.useNegativesInSearch.addEventListener('change', () => {
      this.saveSettings();
    });

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

    // Load useNegativesInSearch setting (default: true)
    if (settings.useNegativesInSearch !== undefined) {
      this.useNegativesInSearch.checked = settings.useNegativesInSearch;
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
        negatives: this.negatives,
        useNegativesInSearch: this.useNegativesInSearch.checked
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

      if (result && result.keywords?.length > 0) {
        const keywords = result.keywords.slice(0, 8);
        const negatives = result.negatives || [];

        // 1. Fill slots with keywords
        this.fillSlotsFromKeywords(keywords);

        // 2. Store negatives
        if (negatives.length > 0) {
          this.negatives = negatives;
          this.displayNegatives();
        }

        // 3. Save settings directly from AI result
        const slotsToSave = [];
        this.slots.forEach((slot, index) => {
          slotsToSave.push({
            keyword: keywords[index] || '',
            color: slot.querySelector('.color-picker').value
          });
        });

        const settingsToSave = {
          slots: slotsToSave,
          enabled: true,
          negatives: negatives
        };

        console.log('Saving AI Build settings:', settingsToSave);
        await chrome.storage.local.set({ automarker_settings: settingsToSave });

        // 4. Build search query: first 4 keywords + negatives (if enabled)
        const queryKeywords = keywords.slice(0, 4);
        let searchQuery;
        if (this.useNegativesInSearch.checked) {
          const negativeTerms = negatives.map(n => {
            const word = n.replace(/^-+/, ''); // Remove leading minus signs
            return `-${word}`;
          });
          searchQuery = [...queryKeywords, ...negativeTerms].join(' ');
        } else {
          searchQuery = queryKeywords.join(' ');
        }

        console.log('Search query:', searchQuery);

        // 5. Open search tab
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        chrome.tabs.create({ url: searchUrl });

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

    // Load custom prompt from storage, or use default
    const data = await chrome.storage.local.get(['automarker_prompt']);
    let promptTemplate = data.automarker_prompt || this.getDefaultPrompt();

    // Replace ${theme} placeholder with actual theme
    const prompt = promptTemplate.replace(/\$\{theme\}/g, theme);

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

  fillSlotsFromKeywords(keywords) {
    if (!keywords || keywords.length === 0) return;

    // Show extended slots if we have more than 4 keywords
    if (keywords.length > 4 && this.extendedSlots.classList.contains('hidden')) {
      this.extendedSlots.classList.remove('hidden');
      this.showMoreBtn.classList.add('active');
      this.showMoreBtn.textContent = '− Less';
    }

    // Fill slots
    keywords.slice(0, 8).forEach((keyword, index) => {
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

  getDefaultPrompt() {
    return `You are an expert research strategist. Given the theme "\${theme}", create a noise-filtering search strategy.

GOAL: Help the user find high-quality, relevant content by selecting keywords that surface expert sources and excluding terms that pollute results with commercial, shallow, or off-topic content.

LANGUAGE RULE: Detect the theme's language and generate ALL output in that SAME language.

Return ONLY valid JSON:
{
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5", "kw6", "kw7", "kw8"],
  "negatives": ["exclude1", "exclude2", "exclude3", "exclude4", "exclude5"]
}

STEP 1: FRESHNESS & PERSONA ANALYSIS
- Is "\${theme}" trend-sensitive (tech, news, market) or timeless (principles, theory)?
- If trend-sensitive: include year like "2025" or "latest" in keywords
- If timeless: include "wiki", "guide", "fundamentals" type words
- Who is searching? (engineer → GitHub/docs, executive → case study/ROI, consumer → review/comparison)
- Add 1-2 keywords that appear on sites this persona trusts

STEP 2: KEYWORDS (8 total)
Choose words that ACTUALLY APPEAR in quality search results:
- [0-1]: Core theme + synonym
- [2-3]: Practical terms real people use
- [4-5]: Quality signals (white paper, research, analysis, implementation)
- [6-7]: Freshness/persona keywords from Step 1

NOTE: Multiple words = combined intent. Avoid academic jargon.

STEP 3: NEGATIVES (5 required)
What SPECIFIC noise pollutes "\${theme}" results?
- EC sites dominating results
- Adjacent but irrelevant fields sharing terminology
- Job/career content (listings, salary, interview)
- Wrong depth (beginner tutorials vs advanced research)
- Noisy platforms (YouTube, TikTok, Pinterest)

ALWAYS INCLUDE EC exclusions (without minus sign):
- Japanese: Amazon, 楽天, Yahoo!ショッピング, 価格.com, 通販
- English: Amazon, eBay, Walmart, shop, buy

IMPORTANT: Return words WITHOUT minus signs. System adds them automatically.
Ensure output is strictly valid JSON. No text before or after the JSON block.`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AutoMarkerPopup();
});
