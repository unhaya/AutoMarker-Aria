# AutoMarker Aria

検索結果のキーワードハイライター。AIで検索戦略を自動生成。

## 何ができるか

「人間工学」で検索すると、Amazon の椅子、楽天のデスク、求人情報ばかり出てくる。

このツールは検索前に AI が戦略を立てる：
- ハイライトすべきキーワード（4階層）
- 除外すべきノイズ（-Amazon -楽天 -求人 等）

結果：ECサイトや求人を除外した検索結果で、重要なキーワードが色分けされる。

## Install

1. [Releases](../../releases) から ZIP をダウンロード
2. 解凍
3. Chrome で `chrome://extensions` を開く
4. 右上の「Developer mode」を ON
5. 「Load unpacked」→ 解凍したフォルダを選択

## Setup

Settings (⚙) で API キーを設定:
- Claude / OpenAI / Gemini

プロンプトのカスタマイズも可能（Advanced セクション）。

## Use

1. テーマを入力
2. AI Build
3. 検索結果が開き、キーワードがハイライトされる

## Highlight Levels

検索結果のキーワードを4色でハイライト：

| Level | Color | 用途 |
|-------|-------|------|
| L1 | Yellow | コアキーワード |
| L2 | Pink | 根拠・効果 |
| L3 | Purple | 品質シグナル |
| L4 | Green | 関連概念 |

- 各スロットの色はカラーピッカーで自由に変更可能
- AI なしでも手動でキーワードを入力してハイライトできる
- 除外ワード（-Amazon -楽天 等）も自動生成

## Cost

- Claude Haiku: ~$0.0003/回
- OpenAI GPT-4o Mini: ~$0.0002/回
- Gemini Flash: 無料（15回/分）

## License

MIT
