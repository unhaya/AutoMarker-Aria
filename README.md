# AutoMarker Aria

検索結果のキーワードハイライター。AIで検索戦略を自動生成。

## Install

1. [Releases](../../releases) から ZIP をダウンロード
2. 解凍
3. `chrome://extensions` → Developer mode ON → Load unpacked

## Setup

Settings (⚙) で API キーを設定:
- Claude / OpenAI / Gemini

## Use

1. テーマを入力
2. AI Build
3. 検索結果が開き、キーワードがハイライトされる

## Highlight Levels

| Level | Color | 用途 |
|-------|-------|------|
| L1 | Yellow | コアキーワード |
| L2 | Pink | 根拠・効果 |
| L3 | Purple | 品質シグナル |
| L4 | Green | 関連概念 |

除外ワード（-Amazon -楽天 等）も自動生成。

## Cost

- Claude Haiku: ~$0.0003/回
- OpenAI GPT-4o Mini: ~$0.0002/回
- Gemini Flash: 無料（15回/分）

## License

MIT
