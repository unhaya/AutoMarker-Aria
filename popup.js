// AutoMarker Aria v5.5 - Pre-Search Intelligence

const PRESETS = {
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

    // Preset select
    this.presetSelect = document.getElementById('presetSelect');

    // Auto-highlight toggle
    this.autoHighlightToggle = document.getElementById('autoHighlightToggle');
  }

  bindEvents() {
    // Master toggle
    this.masterToggle.addEventListener('change', () => {
      this.saveSettings();
      this.applyHighlights();
    });

    // Auto-highlight toggle
    this.autoHighlightToggle.addEventListener('change', () => {
      this.saveSettings();
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

    // Preset select
    this.presetSelect.addEventListener('change', () => {
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

    // Load useNegativesInSearch setting (default: false)
    if (settings.useNegativesInSearch !== undefined) {
      this.useNegativesInSearch.checked = settings.useNegativesInSearch;
    }

    // Load preset (default: 'default')
    if (settings.preset) {
      this.presetSelect.value = settings.preset;
    }

    // Load auto-highlight setting (default: true)
    if (settings.autoHighlight !== undefined) {
      this.autoHighlightToggle.checked = settings.autoHighlight;
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
        useNegativesInSearch: this.useNegativesInSearch.checked,
        preset: this.presetSelect.value,
        autoHighlight: this.autoHighlightToggle.checked
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
        // Check if extended slots (L3-L4) are visible
        const isExpanded = !this.extendedSlots.classList.contains('hidden');
        const maxAiKeywords = isExpanded ? 7 : 3;

        // User theme goes to slot 0 (highest priority), AI keywords fill remaining slots
        const aiKeywords = result.keywords.slice(0, maxAiKeywords);
        const allKeywords = [theme, ...aiKeywords];
        const negatives = result.negatives || [];

        // 1. Fill slots with theme + AI keywords
        this.fillSlotsFromKeywords(allKeywords);

        // 2. Store negatives
        if (negatives.length > 0) {
          this.negatives = negatives;
          this.displayNegatives();
        }

        // 3. Save settings directly from AI result
        const slotsToSave = [];
        this.slots.forEach((slot, index) => {
          slotsToSave.push({
            keyword: allKeywords[index] || '',
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

        // 4. Build search query: theme (必須) + L1b~L2b (slots 1-3) + negatives (if enabled)
        const queryKeywords = [theme, ...allKeywords.slice(1, 4)];
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

    // Check if extended slots (L3-L4) are visible
    const isExpanded = !this.extendedSlots.classList.contains('hidden');

    // Use selected preset as prompt template
    // First check for user's custom presets in storage, fallback to defaults
    const selectedPreset = this.presetSelect.value || 'default';
    const customPresets = await this.loadCustomPresets();
    let promptTemplate = customPresets[selectedPreset] || PRESETS[selectedPreset] || PRESETS.default;

    // If not expanded, modify prompt to generate only 3 keywords (L1b, L2a, L2b)
    if (!isExpanded) {
      promptTemplate = promptTemplate
        .replace(/\["L1b","L2a","L2b","L3a","L3b","L4a","L4b"\]/g, '["L1b","L2a","L2b"]')
        .replace(/keywords \(7 slots\):/g, 'keywords (3 slots):')
        .replace(/- L3a-L3b:.*\n/g, '')
        .replace(/- L4a-L4b:.*\n/g, '');
    }

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
    console.log('Calling Claude with model:', model || 'claude-3-5-haiku-latest');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-haiku-latest',
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

  async loadCustomPresets() {
    try {
      const data = await chrome.storage.local.get(['automarker_presets']);
      return data.automarker_presets || {};
    } catch (e) {
      return {};
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AutoMarkerPopup();
});
