# つむぐ — デザイン仕様書（Tailwind CSS v4 対応）

このファイルは Claude Design で作成されたUIモックから抽出した「正解の見た目」を定義する。
実装時はこのトークンを **一度だけ定義し、全コンポーネントで参照する**こと。
モックのインラインスタイルを個別にコピーしてはいけない（破綻のもと）。

> このプロジェクトは **Tailwind CSS v4** を使用。
> v4 では `tailwind.config.ts` ではなく、CSSファイル内の `@theme` でトークンを定義する。

---

## 1. globals.css にそのまま貼れる定義

`app/globals.css`（または既存のグローバルCSS）の先頭をこの形にする:

```css
@import "tailwindcss";

@theme {
  /* --- カラー --- */
  --color-bg:        #F0EEE9;  /* アプリ全体の背景（アイボリー） */
  --color-paper:     #FFFFFF;  /* カード・記事の紙面 */
  --color-surface:   #FBF8F1;  /* 一段沈んだ面（入力欄・サブパネル） */
  --color-rule:      #E6E0D2;  /* 罫線・ボーダー・区切り */
  --color-ink:       #1B1A17;  /* 主要テキスト（ほぼ黒） */
  --color-ink-sub:   #3A372F;  /* やや弱いテキスト */
  --color-mute:      #807A6E;  /* キャプション・補助テキスト */
  --color-faint:     #B4AEA0;  /* さらに薄いラベル */
  --color-accent:    #E27A2D;  /* アクセント（CTA・強調・進捗バー） */
  --color-marker:    #FFF6BE;  /* テキストのマーカーハイライト */

  /* --- フォント --- */
  --font-serif:   "Noto Serif JP", serif;        /* 本文・見出し（読み物） */
  --font-sans:    "Noto Sans JP", sans-serif;    /* UI・ラベル */
  --font-display: "Bebas Neue", sans-serif;      /* 英字ディスプレイ */
  --font-mono:    "JetBrains Mono", monospace;   /* 数値・コード */

  /* --- 角丸（つむぐはシャープ。丸みは最小限） --- */
  --radius-sm: 2px;
  --radius-md: 4px;

  /* --- 影（この4種類のみ。乱用しない） --- */
  --shadow-card:       0 1px 6px rgba(0,0,0,0.04);
  --shadow-float:      0 6px 16px rgba(0,0,0,0.15);
  --shadow-float-soft: 0 6px 24px rgba(0,0,0,0.08);
}
```

これで Tailwind のユーティリティとして使えるようになる:
`bg-bg` `bg-paper` `text-ink` `text-mute` `bg-accent` `border-rule`
`font-serif` `font-sans` `font-display` `font-mono`
`rounded-sm` `shadow-card` など。**色やフォントを class に直書きしない。**

---

## 2. フォントの読み込み（next/font）

App Router なら `app/layout.tsx` で `next/font/google` を使う:

```ts
import { Noto_Serif_JP, Noto_Sans_JP, Bebas_Neue } from "next/font/google";
// JetBrains Mono も同様に
```

各フォントを `variable` 指定で読み込み、`<html>` か `<body>` の className に
変数を渡して、上の `@theme` の `--font-*` がその CSS 変数を指すようにする。
（CDN の `<link>` でも動くが、Next.js では next/font が推奨。実装は Claude Code に任せてよい）

---

## 3. タイポグラフィの使い分け

| 役割 | フォント | 用途 |
|---|---|---|
| 本文・見出し（読み物） | Noto Serif JP | 記事タイトル、本文、エディタ内テキスト |
| UI・ラベル | Noto Sans JP | ナビ、ボタン、メタ情報など画面のUI |
| ディスプレイ | Bebas Neue | 「STREAK」「GOOD MORNING」等の英字ラベル（大文字・字間広め） |
| 数値・コード | JetBrains Mono | 統計の数字、URLバー |

フォントサイズの頻出値: `10/11/12/13`px = ラベル系、`16`px = 基準、
`17/18`px = やや大きめUI、`22/26/28/36`px = 見出し・ディスプレイ。

設計意図（design-notes より）: 「note の落ち着きに、bluehamham の遊び心を一滴」。
ベースは紙とインクの低彩度トーン。アクセントの橙は **CTA・進行中・選択状態にだけ** 使う。

---

## 4. 画面構成（3画面 × デスクトップ/モバイル）

### A. ダッシュボード (`/home`)
- 上部: ナビバー（つむぐロゴ + BETA / ホーム・エディタ・ライブラリ・設定 / 検索・通知・アバター）
- 左上: マスコット「つむぎ」+ 挨拶「GOOD MORNING, KOTONO」+ 大見出し
- CTA行: 「テーマから自動生成」（橙塗り）「白紙から書く」「下書きを開く」
- 右上: STREAK / PUBLISHED / WORDS/WK の統計カード
- 左下: DRAFTS 一覧（記事カード、進捗バー付き、4件）
- 右下: QUICK START（テーマ入力欄 + タグ）と「つむぎから」の提案カード
- 参照: `design-reference/dashboard-desktop.html` / `dashboard-mobile.html`

### B. エディタ (`/editor/:slug`)
- 上部: ナビバー + 文字数カウンタ + 「プレビュー」「noteに送る」
- 3カラム: 左=OUTLINE（見出しツリー、現在地ハイライト）/ 中=本文エディタ（ツールバー +
  セリフ書体の記事）/ 右=AIアシスタント「つむぎ」（チャット形式、挿入/書き直しボタン）
- 本文中: マーカーハイライト、インラインAI提案
- 参照: `design-reference/editor-desktop.html` / `editor-mobile.html`

### C. note プレビュー (`/preview`)
- note.com 風の公開後イメージ。ヘッダー画像 + 記事 + 著者情報 + フォローボタン
- 上部に「エディタに戻る」「noteに公開」
- 参照: `design-reference/note-preview-desktop.html` / `note-preview-mobile.html`

### モバイル版
- 同じ3画面の縦長レイアウト。ボトムナビ（ホーム/ライブラリ/通知/設定）。
- ステータスバー（7:42）付き = スマホアプリとしての見せ方。

---

## 5. マスコット「つむぎ」

- AIアシスタントの人格。**オリジナルキャラ（原典なし）**。「言葉を紡ぐ、まる豆」。
- 丸い豆型、細い線画、頭の結び目が「紡ぐ」の意。
- 表情バリエーション: idle / happy / thinking / wink / writing。
- 口調ルール: **批評をしない。観察した事実だけを穏やかに伝える「編集者」**。
  例:「段落が3つ続いていて、少し息が詰まりそう。短い一文を挟みませんか？」
- 実装: SVGコンポーネント（例 `components/Tsumugi.tsx`）として作り、表情を prop で切替。
- 参照: `design-reference/mascot-tsumugi.html`

---

## 6. 実装時の絶対ルール

1. トークンは `app/globals.css` の `@theme` に**一度だけ**定義（上記セクション1）。
2. `design-reference/*.html` は**見た目の答え合わせ用**。レイアウト・余白・色をここに合わせる。
   ただしHTMLのインラインスタイルを直接コピペしない（算出値の塊なので破綻する）。
3. 角丸・影・色は本仕様書のトークンだけを使う。モックにない装飾を足さない。
4. レスポンシブは desktop モックと mobile モックの**両方**を満たすこと。
5. 「余白」が最重要。要素を詰めず、モックの余白感を保つ。
6. Tailwind は **v4**。v3 の `tailwind.config.js` 方式を使わない。
