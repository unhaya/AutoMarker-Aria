# AutoMarker Aria

**Your search words, instantly color-coded. No AI, no setup.**

Search on Google (or Bing, Yahoo, DuckDuckGo, Baidu) and every word in your query is automatically highlighted in its own color — on the results page **and** on the pages you click through to.

That's it. No API keys, no accounts, no settings to learn.

## What It Does

1. **You search** as you always do.
2. **Each word lights up** in a distinct color (up to 8 words = 8 colors).
3. **Highlights follow you** onto the pages you visit from the results.

Works with infinite-scroll pages (uAutoPagerize) and dynamically loaded content.

## Install

1. Download ZIP from [Releases](../../releases)
2. Unzip
3. Chrome → `chrome://extensions` → Enable "Developer mode"
4. "Load unpacked" → Select the unzipped folder

## Usage

Just search. Your words are highlighted automatically.

Click the toolbar icon to open the popup:

- **Auto toggle** — turn highlighting on/off
- **L1–L8 colors** — pick a color for each of the up-to-8 search words
- **COLOR RESET** — restore the default palette

## Colors

| Slot | Default | Slot | Default |
|------|---------|------|---------|
| L1 | Yellow | L5 | Orange |
| L2 | Pink   | L6 | Sky    |
| L3 | Purple | L7 | Red    |
| L4 | Green  | L8 | Lime   |

Your first search word gets L1's color, the second gets L2's, and so on (up to 8). Colors are saved locally and persist across sessions.

## Privacy

No data is collected or sent anywhere. Everything runs locally in your browser. Your color settings live in `chrome.storage.local`.

## License

MIT
