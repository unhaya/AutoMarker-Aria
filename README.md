# AutoMarker Aria

**"Design your search before you search."** — A Chrome extension that transforms how you find information.

---

## The Problem

You type keywords into Google. You get a million results. You scroll. You skim. You get tired.

**AutoMarker Aria flips this.**

Instead of searching and then filtering, you **design your search strategy first** — then let Google do the heavy lifting while Aria highlights what matters.

```
Traditional: Keywords → Search → Manually scan millions of results → Exhaustion

Aria: Theme → AI Strategy → Search → Important info visually pops out
```

---

## How It Works (30 seconds)

### Before (Traditional Search)
1. Search "ergonomics"
2. Get 100 million results
3. Can't tell what's important
4. Distracted by ads and sales pages
5. Give up

### After (Aria Search)
1. Enter theme: "Ergonomics"
2. Click **AI Build**
3. AI designs search strategy in 1 second
4. Google search auto-executes
5. **Core concepts = Yellow**, **Evidence = Pink**, **Noise = Strikethrough**
6. Information you need **visually surfaces**

---

## Features

### AI Build (One-Click Intelligence)
Enter a theme. Click once. AI generates everything:

| Generated | Description |
|-----------|-------------|
| Search Query | Optimized query with noise exclusions |
| L1 Keywords | Core concepts (Yellow highlight) |
| L2 Keywords | Evidence & data (Pink highlight) |
| L3 Keywords | Context & technical terms (Purple highlight) |
| L4 Keywords | Related concepts (Green highlight) |
| Negatives | Commercial noise (Strikethrough + fade) |

### 4-Color Hierarchy
Information importance is **instantly visible**. No more scanning walls of text.

### Negatives (Noise Suppression)
Words like "sale," "buy," "amazon" are auto-detected and visually suppressed. **Only the signal remains.**

---

## Who This Is For

- Researchers drowning in search results
- Students writing papers
- Engineers hunting technical documentation
- Anyone tired of "search fatigue"

---

## Installation

### Chrome Web Store
*Coming soon*

### Manual Install
1. Download from [Releases](../../releases)
2. Unzip to any folder
3. Open `chrome://extensions`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked" → Select the folder

---

## Usage

### AI Build (Recommended)
1. Click the extension icon
2. Click ⚙ to configure AI (Claude / ChatGPT / Gemini)
3. Enter a theme (e.g., "Ergonomics", "Quantum Computing", "Investment Strategy")
4. Click **AI Build**
5. Strategy → Google Search → Highlights — **all automatic**

### Manual Mode
Don't want AI? Just type keywords directly into the slots.

---

## Supported AI Providers

| Provider | Recommended Model | Notes |
|----------|-------------------|-------|
| **Claude** | Claude 3.5 Haiku | Fast & cheap (recommended) |
| **OpenAI** | GPT-4o Mini | Reliable |
| **Gemini** | Gemini 2.0 Flash | Free tier available |

---

## Why I Built This

Search should be an **intellectual act**.

But it became a passive chore — type something, hope for the best, scroll endlessly.

Aria makes search a **design act**.

"For this topic, the core is X, the evidence is Y, the noise is Z."

This **Pre-Search thinking** happens in one second with AI, then you cast a **strategically designed net** into Google's vast ocean.

That's AutoMarker Aria.

---

## Technical Specs

- **Manifest V3** compliant
- **Service Worker** for efficient background processing
- **MutationObserver** for dynamic content
- **TreeWalker API** for high-speed text node traversal

---

## File Structure

```
AutoMarker-Aria/
├── manifest.json     # Extension config
├── background.js     # Search detection & auto-trigger
├── content.js        # Highlight engine
├── content.css       # Highlight styles
├── popup.html/css/js # UI with AI Build
├── options.html/js   # API configuration
└── icons/            # Extension icons
```

---

## License

MIT License

---

## Philosophy

**"For searches that truly matter, use Aria."**

Once you experience the difference, you won't go back to staring at a blank search box hoping for the best.
