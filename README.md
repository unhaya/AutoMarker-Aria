# AutoMarker Aria

AIが検索キーワードを生成 → 検索結果でキーワードをカラーハイライト

## Demo

https://github.com/user-attachments/assets/fb6a90f3-45d1-4468-a895-e876f8944121

## 機能

1. **AI Build**: テーマを入力 → AIがキーワード8個 + 除外ワードを生成 → Google検索
2. **ハイライト**: 検索結果ページでキーワードが色付きで表示される
3. **手動入力**: APIなしでも使える。キーワードを直接入力するだけ

## インストール

1. [Releases](../../releases)からZIPダウンロード
2. 解凍
3. Chrome → `chrome://extensions` → 「デベロッパーモード」ON
4. 「パッケージ化されていない拡張機能を読み込む」→ 解凍フォルダを選択

## 設定

⚙ → APIキーを設定（Claude / OpenAI / Gemini）

## コスト

| Provider | 1回 | 100回 | 1000回 |
|----------|-----|-------|--------|
| Claude Haiku | $0.0003 | $0.03 | $0.30 |
| GPT-4o Mini | $0.0002 | $0.02 | $0.20 |
| Gemini Flash | 無料枠 | 無料枠 | 無料枠 |

## License

MIT
