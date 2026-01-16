# AutoMarker Aria

**AI builds your search strategy before you search.**

Enter a topic. AI instantly generates keywords to find, noise to exclude, and executes an optimized Google search—all in one click.

> **Cost:** ~$0.0003 per search. **100 searches = ~$0.03 (less than 5 yen).** Gemini free tier also available.

<!--
TODO: Add demo GIF here
![Demo](docs/demo.gif)
-->

---

## The Core Problem

Google is broken for serious research.

Search "ergonomics" and you get:
- **Page 1:** Amazon chairs, Rakuten desks, shopping ads
- **Page 2:** More products, affiliate blogs, job listings
- **Page 3:** Finally, maybe some actual content

You wanted research. You got a shopping mall.

---

## What Aria Does

**1. AI Strategy (the main feature)**

You type a topic. AI thinks:
> "What does someone searching 'ergonomics' actually want? Academic papers? Workplace guidelines? What noise will pollute results?"

Then generates:
- **8 keywords** to find (theme, synonyms, quality signals)
- **5+ exclusions** to remove (-Amazon -楽天 -chair -desk -job)
- **Optimized query** that executes automatically

**2. Visual Highlighting**

On the search results page:
- Core concepts → Yellow
- Evidence/practical terms → Pink
- Quality signals → Purple
- Related concepts → Green
- Commercial noise → ~~Strikethrough~~

**Result:** One click. Clean results. Important words jump out.

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
