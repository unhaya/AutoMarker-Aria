# AutoMarker Aria

Chrome extension. Keyword highlighter for search results with AI-powered search strategy generation.

## Demo

https://github.com/user-attachments/assets/fb6a90f3-45d1-4468-a895-e876f8944121

## What It Does

Search "ergonomics" and you get Amazon chairs, Rakuten desks, job listings. Page after page of noise.

This tool builds a strategy *before* you search:
- Keywords to highlight (4-tier hierarchy)
- Noise to exclude (-Amazon -Rakuten -jobs etc.)

Result: Search results filtered from EC sites and job listings, with important keywords color-coded.

## Install

1. Download ZIP from [Releases](../../releases)
2. Unzip
3. Open `chrome://extensions` in Chrome
4. Enable "Developer mode" (top-right toggle)
5. Click "Load unpacked" → Select the unzipped folder

## Setup

Settings (⚙) to configure API key:
- Claude / OpenAI / Gemini

Custom prompt available in Advanced section.

## Use

1. Enter theme
2. Click AI Build
3. Search opens with keywords highlighted

## Highlight Levels

4 colors × 2 slots (8 total) for keyword highlighting:

| Level | Color | Slots | Purpose |
|-------|-------|-------|---------|
| L1 | Yellow | 2 | Core — Theme essence |
| L2 | Pink | 2 | Evidence — Proof & effects |
| L3 | Purple | 2 | Signals — Quality indicators |
| L4 | Green | 2 | Related — Related concepts |

- Color picker available for each slot
- Manual keyword input works without AI
- Exclusion words (-Amazon -Rakuten etc.) auto-generated

## Cost

| Provider | 1x | 100x | 1000x |
|----------|-----|-------|--------|
| Claude Haiku | $0.0003 | $0.03 | $0.30 |
| OpenAI GPT-4o Mini | $0.0002 | $0.02 | $0.20 |
| Gemini Flash | Free tier | Free tier | Free tier |

Gemini: Free tier available (15 RPM, 1500 RPD limit).

## License

MIT

---

*Search should be an intellectual act.*
