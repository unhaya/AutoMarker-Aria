# AutoMarker Aria

**AI prepares your weapons. You do the hunting.**

## Why This Exists

When exploring unfamiliar territory, you don't know what noise to filter out.

Search "ergonomics" → Amazon chairs, Rakuten desks, job listings flood your results. You didn't know to exclude them because you're new to the field.

**Perplexity approach**: AI searches for you, gives you answers.
**Aria approach**: AI builds your search strategy, you explore and judge.

The difference matters. AI can predict noise in domains it knows. But discovery—finding unexpected connections, questioning sources, building understanding—that's human work.

This tool lets AI do what it's good at (predicting junk), so you can do what you're good at (thinking).

## Demo

https://github.com/user-attachments/assets/fb6a90f3-45d1-4468-a895-e876f8944121

## What It Does

1. **AI generates**: Keywords to highlight + Noise to exclude
2. **You search**: Clean results with important terms color-coded

## Install

1. Download ZIP from [Releases](../../releases)
2. Unzip
3. Chrome → `chrome://extensions` → Enable "Developer mode"
4. "Load unpacked" → Select the unzipped folder

## Setup

⚙ → Set API key (Claude / OpenAI / Gemini)

Custom prompt available in Advanced section.

## Usage

### With AI
1. Enter theme
2. Click AI Build
3. Search opens with keywords highlighted

### Without AI
No API key needed. Type keywords directly into slots — highlights work on any page.

## Highlight Levels

4 colors × 2 slots (8 total):

| Level | Color | Slots | Purpose |
|-------|-------|-------|---------|
| L1 | Yellow | 2 | Core — Theme essence |
| L2 | Pink | 2 | Evidence — Proof & effects |
| L3 | Purple | 2 | Signals — Quality indicators |
| L4 | Green | 2 | Related — Peripheral concepts |

Colors are customizable per slot. Exclusion words (-Amazon -Rakuten etc.) are AI-generated.

## Cost

| Provider | 1x | 100x | 1000x |
|----------|-----|-------|--------|
| Claude Haiku | $0.0003 | $0.03 | $0.30 |
| GPT-4o Mini | $0.0002 | $0.02 | $0.20 |
| Gemini Flash | Free tier | Free tier | Free tier |

Gemini: Free tier available (15 RPM, 1500 RPD limit)

## License

MIT
