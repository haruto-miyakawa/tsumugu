<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:tsumugu-design-rules -->
# つむぐ — デザイン実装ガイド

> このセクションは「つむぐ」のUIを Claude Design のモック通りに仕上げるための規約。
> 上の nextjs-agent-rules（Next.js 16 のドキュメントを先に読む）は引き続き厳守すること。

## 何をするか

このプロジェクトは Phase 1〜4 の機能が実装済み。**足りないのは見た目だけ**。
Claude Design で作ったUIモックの「デザイン言語」（配色・書体・余白・質感）を、
既存の画面・コンポーネントに適用してビジュアルを刷新する。

## 重要：モックと既存画面は1対1で対応しない

- モックの画面: ダッシュボード / エディタ / note プレビュー
- 実際の画面: `/`（ダッシュボード）/ `/generate`（記事生成・ナビ非表示）/ `/editor/[id]`（エディタ・ナビ非表示）/ `/library`（ライブラリ）/ `/preview/[id]`（note風プレビュー）/ `/settings`（設定）。ナビは「ホーム / ライブラリ / 設定」の3タブ。旧ルート `/format*`・`/style` は 301 リダイレクト済み
- → モックは「画面の設計図」ではなく **「デザインの辞書」** として使う。
  モックの配色・カード質感・ボタン・タイポグラフィ・マスコットの扱いを抽出し、
  既存の4画面すべてに一貫して適用する。レイアウトを無理にモックへ合わせない。
- モックの「エディタ」3カラムUIは、`/generate` や `/editor/[id]` の編集体験を
  リッチにする際の**参考**にしてよい（必須ではない）。

## 参照ファイル

- `DESIGN_SPEC.md` … デザイントークン（色・書体・形状）と画面仕様。**スタイルの一次ソース**。
- `design-reference/*.html` … UIモック9枚。**見た目の答え合わせ用**。
  HTMLのインラインstyleは直接コピペしない（ブラウザ算出値の塊。意図を読んで実装する）。

## デザイン実装の鉄則

1. 作業前に必ず `DESIGN_SPEC.md` を読む。色・フォント・余白はその定義に従う。
2. トークンは `app/globals.css` の `@theme` に**一度だけ**定義（Tailwind v4 方式）。
   全コンポーネントは Tailwind ユーティリティ（`bg-bg` `text-ink` `font-serif` 等）で参照。
   色・フォントサイズをコンポーネントに直書きしない。
3. **1回のタスクで1画面 or 1コンポーネント群ずつ**進める。全部を一度に変えない。
4. 変更したら対応する `design-reference/*.html` と見比べ、配色・余白・質感のズレを
   自分で指摘し、修正してから完了とする。
5. モックにない装飾（過度な角丸・影・グラデ・絵文字）を足さない。
   「つむぐ」は紙とインクの落ち着いたトーン。余白を最優先。
6. レスポンシブは desktop / mobile 両モックの質感を満たす。

## コンポーネント別の指針

- `components/ui/` (Button/Card/Select/TextArea/LoadingSpinner) … **最初にここを着手**。
  モックのボタン・カード・入力欄の質感に合わせる。ここが整うと全画面が一気に良くなる。
- `components/layout/` (Header/MobileNav/PageContainer) … モックのナビバー／
  ボトムナビ／余白設計に合わせる。
- `components/ui/Tsumugi.tsx` … **既存**。`design-reference/mascot-tsumugi.html` を見て、
  まる豆型・細線・頭の結び目の造形に寄せる。表情 prop（idle/happy/thinking/wink/writing）。
  口調は「批評せず観察した事実だけ伝える編集者」。
- 各 `page.tsx` … ui/layout が整ってから、画面単位で仕上げる。

## 進め方

- 大きな変更前に短くプランを出してから着手。
- 既存コードと機能を尊重。動いている API・ロジックは壊さない。
- 各ステップで「なぜそうするか」を一言添える。
- 不明点は推測せず確認する。

## してはいけないこと

- `design-reference/` と `DESIGN_SPEC.md` を編集・削除しない（読み取り専用）。
- 実装済みの機能・API・データ構造を、デザイン目的で壊さない。
- APIキーをコードに直書きしない（`.env.local` を使う）。
<!-- END:tsumugu-design-rules -->

<!-- BEGIN:tsumugu-design-rules -->
# つむぐ — デザイン実装ガイド

> このセクションは「つむぐ」のUIを Claude Design のモック通りに仕上げるための規約。
> 上の nextjs-agent-rules（Next.js 16 のドキュメントを先に読む）は引き続き厳守すること。

## 何をするか

このプロジェクトは Phase 1〜4 の機能が実装済み。**足りないのは見た目だけ**。
Claude Design で作ったUIモックの「デザイン言語」（配色・書体・余白・質感）を、
既存の画面・コンポーネントに適用してビジュアルを刷新する。

## 重要：モックと既存画面は1対1で対応しない

- モックの画面: ダッシュボード / エディタ / note プレビュー
- 実際の画面: `/`（ダッシュボード）/ `/generate`（記事生成・ナビ非表示）/ `/editor/[id]`（エディタ・ナビ非表示）/ `/library`（ライブラリ）/ `/preview/[id]`（note風プレビュー）/ `/settings`（設定）。ナビは「ホーム / ライブラリ / 設定」の3タブ。旧ルート `/format*`・`/style` は 301 リダイレクト済み
- → モックは「画面の設計図」ではなく **「デザインの辞書」** として使う。
  モックの配色・カード質感・ボタン・タイポグラフィ・マスコットの扱いを抽出し、
  既存の4画面すべてに一貫して適用する。レイアウトを無理にモックへ合わせない。
- モックの「エディタ」3カラムUIは、`/generate` や `/editor/[id]` の編集体験を
  リッチにする際の**参考**にしてよい（必須ではない）。

## 参照ファイル

- `DESIGN_SPEC.md` … デザイントークン（色・書体・形状）と画面仕様。**スタイルの一次ソース**。
- `design-reference/*.html` … UIモック9枚。**見た目の答え合わせ用**。
  HTMLのインラインstyleは直接コピペしない（ブラウザ算出値の塊。意図を読んで実装する）。

## デザイン実装の鉄則

1. 作業前に必ず `DESIGN_SPEC.md` を読む。色・フォント・余白はその定義に従う。
2. トークンは `app/globals.css` の `@theme` に**一度だけ**定義（Tailwind v4 方式）。
   全コンポーネントは Tailwind ユーティリティ（`bg-bg` `text-ink` `font-serif` 等）で参照。
   色・フォントサイズをコンポーネントに直書きしない。
3. **1回のタスクで1画面 or 1コンポーネント群ずつ**進める。全部を一度に変えない。
4. 変更したら対応する `design-reference/*.html` と見比べ、配色・余白・質感のズレを
   自分で指摘し、修正してから完了とする。
5. モックにない装飾（過度な角丸・影・グラデ・絵文字）を足さない。
   「つむぐ」は紙とインクの落ち着いたトーン。余白を最優先。
6. レスポンシブは desktop / mobile 両モックの質感を満たす。

## コンポーネント別の指針

- `components/ui/` (Button/Card/Select/TextArea/LoadingSpinner) … **最初にここを着手**。
  モックのボタン・カード・入力欄の質感に合わせる。ここが整うと全画面が一気に良くなる。
- `components/layout/` (Header/MobileNav/PageContainer) … モックのナビバー／
  ボトムナビ／余白設計に合わせる。
- `components/ui/Tsumugi.tsx` … **既存**。`design-reference/mascot-tsumugi.html` を見て、
  まる豆型・細線・頭の結び目の造形に寄せる。表情 prop（idle/happy/thinking/wink/writing）。
  口調は「批評せず観察した事実だけ伝える編集者」。
- 各 `page.tsx` … ui/layout が整ってから、画面単位で仕上げる。

## 進め方

- 大きな変更前に短くプランを出してから着手。
- 既存コードと機能を尊重。動いている API・ロジックは壊さない。
- 各ステップで「なぜそうするか」を一言添える。
- 不明点は推測せず確認する。

## してはいけないこと

- `design-reference/` と `DESIGN_SPEC.md` を編集・削除しない（読み取り専用）。
- 実装済みの機能・API・データ構造を、デザイン目的で壊さない。
- APIキーをコードに直書きしない（`.env.local` を使う）。
<!-- END:tsumugu-design-rules -->
