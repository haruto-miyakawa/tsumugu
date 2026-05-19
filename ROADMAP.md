# note記事生成アプリ ロードマップ

## Phase 1 — スタイル設定 ✅

`/style` ページ。自分の文体・構成スタイルを `StyleConfig` として登録・管理する。

**実装済み**
- `GET /api/style` — 保存済みスタイルの読み込み
- `PUT /api/style` — スタイルの保存
- `StyleDisplay` — 現在のスタイルを見やすく表示
- `StyleEditor` — JSON直編集エディタ

---

## Phase 2 — スタイルAI解析 ✅

`/style` ページ下部。既存のnote記事を貼り付けると、AIが文体を自動解析して `StyleConfig` を生成する。

**実装済み**
- `POST /api/style/analyze` — Anthropic tool_use でStyleConfigを構造化抽出
- `StyleAnalyzer` — テキスト貼り付け → 解析結果プレビュー → 適用 の3ステップUI

---

## Phase 3 — 記事生成 ✅

`/generate` ページ。書きたいテーマ・エピソードを入力し、Phase 1/2 で設定したスタイルに沿った記事をAIが生成する。

**実装済み**
- `GenerateForm` — 入力フォーム（テーマ、エピソード、ターゲット読者、長さ、追加メモ）
- `POST /api/generate` — StyleConfig を読んでClaudeに渡し、タイトル候補3つ + Markdown本文を生成・保存
- `ArticleResult` — タイトル候補の選択UI + Markdownプレビュー + 整形ページへのリンク
- `GET /api/articles` — 生成済み記事一覧
- `GET /api/articles/[id]` — 個別記事取得
- `PATCH /api/articles/[id]` — タイトル選択・ステータス更新
- ダッシュボードの「最近の生成記事」カードに実際の記事一覧を表示

---

## Phase 4 — 整形・プレビュー ✅

`/format` ページ。生成した記事をnote向けに整形し、画像の配置案を確認してコピーする。

**実装済み**
- `app/format/page.tsx` — 全記事をステータス付きで一覧表示
- `app/format/[id]/page.tsx` — 記事ごとの整形・コピーページ
- `POST /api/articles/[id]/format` — 本文にハッシュタグを付与してformattedTextを生成、ステータスを"formatted"に更新
- `FormatPreview` — タイトルコピー + 本文コピーボタン付きプレビュー
- `POST /api/articles/[id]/images` — 画像アップロード + Claude HaikuによるAI配置提案
- `GET /api/images/[filename]` — アップロード済み画像の配信
- `ImageManager` — 画像アップロードUI + 配置提案の一覧表示
- 「本文をコピー」でステータスを"copied"に自動更新
