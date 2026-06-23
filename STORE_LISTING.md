# Chrome Web Store 提出素材 — AutoMarker Aria v2.0.0

[JST 2026-06-23] 桃作成。ダッシュボードにコピペする用。審査3核（プライバシーURL / 権限正当化 / データ宣言）を全部用意済み。

提出先: https://chrome.google.com/webstore/devconsole （初回 $5 登録）
アップロードzip: `AutoMarker-Aria-v2.0.0.zip`（このフォルダ）

---

## プライバシーポリシー URL（必須・配置済み・到達確認済み HTTP 200）

```
https://mirucchi.greenleaf-planning.com/automarker/privacy/
```

---

## ストア掲載情報

### 名前
```
AutoMarker Aria
```

### 概要（Summary・132文字以内）
```
Your search words, color-coded automatically. No typing, no setup — just search, and each word lights up in its own color.
```

### 詳細説明（Description）
```
AutoMarker Aria highlights your search words in distinct colors — automatically.

Most highlighters make you type your keywords twice: once in the search box, then again into the extension. AutoMarker doesn't. You already typed your words in the search box, so it just uses them.

WHAT IT DOES
• Search on Google (or Bing, Yahoo, DuckDuckGo, Baidu) and every word in your query lights up in its own color.
• Up to 8 words, 8 distinct colors (L1–L8) — track multiple terms at a glance.
• Highlights follow you onto the pages you open from the results.
• Works with infinite-scroll pages and dynamically loaded content.

SIMPLE BY DESIGN
• No account, no API key, no setup.
• Nothing to configure — install and it just works.
• Pick your own colors for L1–L8, or hit COLOR RESET to restore the defaults.

PRIVACY
• No data is collected. No external servers. Everything runs locally in your browser.
• Your color settings are stored locally via chrome.storage.local and never leave your device.
```

### カテゴリ
```
Productivity （生産性）
```

### 言語
```
English（日本語UIも動くが、説明は英語ベースで世界向け）
```

---

## データ使用宣言（Privacy practices タブ）

この拡張は **データを一切収集・送信しない**。各項目こう答える:

- **Does this item collect or use user data?** → 機能上 chrome.storage.local にローカル保存はするが、**外部送信・収集はゼロ**。
  - 収集データ種別: **該当なし（None）** を選ぶ。色設定と直近の検索語はローカル保存のみで、サーバーに送られないため「collect（収集）」に当たらない。
- 3つの必須証明（チェック）:
  - ☑ I do not sell or transfer user data to third parties, outside of the approved use cases
  - ☑ I do not use or transfer user data for purposes that are unrelated to my item's single purpose
  - ☑ I do not use or transfer user data to determine creditworthiness or for lending purposes
- **Privacy policy URL**: 上記URLを貼る

---

## 権限の正当化（Permissions justification 欄）

`<all_urls>` は手動審査を確実にトリガーする。下記をそのまま貼る:

### host permission `<all_urls>` の理由
```
The extension highlights the user's search words on any page they open from search results. Because the user can navigate to any website, the set of target sites cannot be known in advance, so broad host access is required for the core highlighting feature to work on every page. This access is used solely to read and visually highlight text within the page DOM. No page content is ever transmitted off the device.
```

### その他の権限
```
storage   — Save the user's L1–L8 color choices and on/off state locally.
scripting — Inject the highlight content script when navigating to a new page.
tabs / activeTab — Detect navigation so highlighting can be re-applied on the newly loaded page.
```

### single purpose（単一目的）
```
A single purpose: automatically highlight the user's search query words on web pages. The 8-color support and on/off toggle are part of this one purpose, not separate features.
```

---

## スクリーンショット（1280x800 か 640x400 が必要）

手元素材:
- `GitHub_Screenshot.jpg` — ポップアップUI（L1-L8カラーグリッド）
- 検索結果で「りんご/みかん/ぶどう」が3色に光っている実動作スクショ ← **これを1枚目推奨**（説明より雄弁）

※ストアは最低1枚、推奨5枚。実動作 → ポップアップ の順が訴求強い。
※サイズが合わなければ余白を足して 1280x800 に整える。

---

## アイコン
- 128x128 PNG（`icons/icon128.png`）が必要。配置済み。

---

## 提出手順（はしくん作業）
1. https://chrome.google.com/webstore/devconsole で $5 登録（初回のみ・生涯有効）
2. 「新しいアイテム」→ `AutoMarker-Aria-v2.0.0.zip` をアップロード
3. 上記の説明文・カテゴリ・言語を貼る
4. スクリーンショット 1〜5枚アップload
5. Privacy practices タブ: データ宣言（None）＋3チェック＋プライバシーURL
6. 権限正当化欄に `<all_urls>` 理由を貼る
7. 公開範囲を選ぶ（**Unlisted=限定公開** にすればURL知ってる人だけ。知り合い配布向き）
8. 審査提出 → `<all_urls>` のため数日〜最大3週間。却下ではなく遅延が正常

---

## 公開後
- privacy.html を更新したい時: `D:\main\python_cord\AutoMarker-Aria\privacy.html` を直し、VPS `~/AIGirl/public/mirucchi/automarker/privacy/index.html` に scp で上書き。
- 拡張を更新する時: manifest version を上げて再zip → ダッシュボードで新版アップ → 全ユーザーに自動配信。
