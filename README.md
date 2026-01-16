# AutoMarker Aria

**Pre-Search Intelligence. Tiered highlighting engine.**

Google is no longer a search engine—it's a shopping mall. Aria is a browser-side surgical blade designed to bypass SEO noise and execute high-purity research.

> **Cost:** ~$0.03 per 100 searches. Gemini free tier available.

---

## The Problem

Search "ergonomics" and you get Amazon chairs, Rakuten desks, affiliate blogs, job listings. Page after page of commercial recommendations masquerading as information retrieval.

The signal-to-noise ratio of modern search is broken.

---

## The Design: Pre-Search Intelligence

Most tools analyze the page *after* you land. Aria builds the strategy *before* you search.

The AI (Claude/OpenAI/Gemini) acts as a Strategy Consultant to define:

| Layer | Purpose | Example |
|-------|---------|---------|
| **L1 (Yellow)** | The Core — non-negotiable essence | 人間工学, ergonomics |
| **L2 (Pink)** | The Evidence — terms in quality content | 効果, 研究, analysis |
| **L3 (Purple)** | The Signals — contextual markers | 事例, expert, データ |
| **L4 (Green)** | The Related — conceptual expansion | 生産性, workplace |
| **Negatives** | The Noise — intentional exclusion | -Amazon -楽天 -chair -job |

This is not random highlighting. It's a 4-tier information architecture applied to search results.

---

## Why This Exists

Humanity needs 20% of information to make 100% of decisions. The remaining 80% is cognitive debt.

Aria cancels that debt.

---

## Quick Start

### 1. Install

**Option A: Download ZIP** (recommended)
- Go to [Releases](../../releases) → Download the latest `.zip` file
- Unzip to any folder (e.g., Desktop)

**Option B: Clone repository**
```bash
git clone https://github.com/unhaya/AutoMarker-Aria.git
```

**Then load into Chrome:**

1. Open `chrome://extensions` in your browser
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked** → Select the unzipped/cloned folder
4. Done! AutoMarker icon appears in toolbar

> **Tip:** If you don't see the icon, click the puzzle piece (🧩) in Chrome toolbar and pin AutoMarker.

### 2. Configure AI (one-time)
- Click extension icon → ⚙ Settings
- Choose provider: **Claude**, **OpenAI**, or **Gemini**
- Enter API key

### 3. Use
- Click extension icon
- Enter topic (e.g., "behavioral economics")
- Click **AI Build**
- Done. Search opens with highlights applied.

---

## Features

### AI-Generated Search Strategy
| What AI Creates | Purpose |
|-----------------|---------|
| 8 Keywords | Terms to highlight (hierarchical colors) |
| 5+ Exclusions | Noise to filter from search (-Amazon -楽天 etc.) |
| Optimized Query | Auto-executes in Google |

### 4-Level Highlight Hierarchy
| Level | Color | Contains |
|-------|-------|----------|
| L1 | Yellow | Core theme + synonyms |
| L2 | Pink | Practical terms (効果, benefits, how) |
| L3 | Purple | Quality signals (研究, analysis, expert) |
| L4 | Green | Related concepts |

### Noise Suppression
Commercial words appear with strikethrough + fade. Your eyes skip them automatically.

### Manual Mode
Don't want AI? Type keywords directly into slots.

---

## Supported AI Providers & Cost

| Provider | Model | Cost per Search | Notes |
|----------|-------|-----------------|-------|
| **Claude** | Haiku 3.5 | ~$0.0003 | Recommended (fast + cheap) |
| **OpenAI** | GPT-4o Mini | ~$0.0002 | Reliable |
| **Gemini** | 2.0 Flash | Free* | Free tier: 15 requests/min |

**Real-world cost:**
- 100 searches = **~$0.03** (less than 5 yen)
- 1,000 searches = **~$0.30** (about 45 yen)
- Gemini free tier = **$0** (15 requests/min limit)

**It's essentially free.** The time saved on a single search pays for hundreds of AI calls.

*API keys required. Get yours:*
- Claude: [console.anthropic.com](https://console.anthropic.com)
- OpenAI: [platform.openai.com](https://platform.openai.com)
- Gemini: [aistudio.google.com](https://aistudio.google.com)

---

## Who This Is For

- **Researchers** drowning in irrelevant results
- **Students** writing papers
- **Engineers** hunting documentation
- **Analysts** filtering signal from noise
- **Anyone** tired of scrolling past Amazon links

---

## How the AI Strategy Works

When you search "人間工学" (ergonomics), AI thinks:

> "Someone searching this probably wants academic/professional content, not shopping results."

**Keywords generated:**
- 人間工学, エルゴノミクス (theme + synonym)
- 効果, 改善 (practical terms)
- 研究, 事例 (quality signals)
- 作業環境, 生産性 (related concepts)

**Exclusions generated:**
- -椅子 -デスク -マウス (product categories)
- -Amazon -楽天 -通販 (shopping sites)
- -求人 -資格 (job/career noise)

**Result:** Cleaner search, highlighted insights, zero scrolling fatigue.

---

## Technical Details

- **Manifest V3** compliant
- **Service Worker** background processing
- **MutationObserver** for dynamic content (Google loads results progressively)
- **TreeWalker API** for fast text node traversal
- **chrome.storage** for settings persistence

### File Structure
```
AutoMarker-Aria/
├── manifest.json      # Extension config
├── background.js      # Auto-trigger on search pages
├── content.js         # Highlight engine
├── content.css        # Highlight styles
├── popup.html/css/js  # Main UI
├── options.html/js    # API configuration
└── icons/             # Extension icons
```

---

## Privacy

- **No data collection** — Everything runs locally
- **API calls only** — Your theme is sent to AI provider (Claude/OpenAI/Gemini)
- **No tracking** — No analytics, no telemetry

---

## License

MIT License — Use freely, modify freely.

---

## Philosophy

Search should be an **intellectual act**, not passive scrolling.

Aria makes you think *before* you search:
- "What am I really looking for?"
- "What noise will I encounter?"
- "What signals indicate quality content?"

This thinking happens in 1 second with AI. Then you cast a **strategically designed net** into Google's ocean.

**For searches that truly matter, use Aria.**
