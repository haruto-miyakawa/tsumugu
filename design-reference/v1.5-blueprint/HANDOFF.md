# つむぐ — Note記事 半自動作成Webアプリ / 技術スタック・デザインハンドオフ

このドキュメントは Claude Code にそのまま投げて、本プロトタイプを下敷きにフロント実装を進めてもらうための仕様書です。

**機能仕様は別ファイル `FEATURES.md` を参照してください。**（画面ごとの挙動、データモデル、API、ショートカット、状態遷移 ほか）

---

## 1. アプリ概要

- **プロダクト名**: つむぐ (tsumugu) — 言葉を紡ぐ、の意
- **目的**: noteの記事を半自動で作成する Web アプリ
- **メインフロー**: テーマ/キーワードを入力 → 構成案 + 本文を AI 生成 → エディタで仕上げ → noteにエクスポート
- **画面構成**:
  1. ダッシュボード（記事一覧 / 下書き管理 / クイック生成）
  2. エディタ（AIアシスト付き · 3レイアウト × 3 AI位置を切替可）
  3. プレビュー（note風 読み物レイアウト）
- **対応デバイス**: デスクトップ + モバイル (iPhone想定)
- **マスコット**: 「つむぎ」(オリジナルキャラクター・原典なし) — 編集者人格の AI

---

## 2. 推奨フレームワーク (このプロトはどう作ったか / 本実装の推奨)

| レイヤ | プロトタイプ | 本実装の推奨 |
|---|---|---|
| UI フレームワーク | React 18.3.1 (UMD + Babel standalone) | **Next.js 15 (App Router) + React 19** または Remix |
| 言語 | JSX (inline) | **TypeScript** |
| スタイリング | 全インラインスタイル + 共有 `T` トークン | **CSS Modules** または **Vanilla Extract** + tokens (Tailwind は今回の余白思想と相性悪いので非推奨) |
| 状態 | `useState` のみ | Zustand / React Query (TanStack Query) |
| エディタ | 静的モック (contentEditable 1か所) | **Tiptap (ProseMirror)** または **Lexical** — 構造化された JSON ドキュメントで扱う |
| AI 連携 | UI モック | OpenAI / Anthropic API + Vercel AI SDK (`useChat` / `useCompletion`) |
| ストレージ | なし | Supabase (Postgres + Auth) または PlanetScale |
| note 連携 | UI モック | note は公式 API がないため、エクスポートは「クリップボードコピー」「Markdown ダウンロード」「下書き用 HTML」を提供する形で実装 |
| ホスティング | — | Vercel / Cloudflare Pages |

---

## 3. デザインシステム — 完全コピペ可能なトークン

```ts
// tokens.ts
export const tokens = {
  color: {
    bg:       '#F0EEE9', // ウォーム生成り（背景）
    paper:    '#FFFFFF', // カード / 紙面
    surface:  '#FBF8F1', // ベージュ寄りの面
    surface2: '#F1ECDF',
    rule:     '#E6E0D2', // 罫線
    ink:      '#1B1A17', // 墨色（本文・主要テキスト）
    inkSoft:  '#3A372F',
    mute:     '#807A6E', // 補助テキスト
    muteSoft: '#B4AEA0',
    highlight:'#FFF6BE', // 黄マーカー (AI候補のハイライト)

    // accents — Tweaksで切替可能な3パターン
    accentPink:  '#E84B7C', // デフォルト (bluehamham寄りのホットピンク)
    accentMint:  '#2BC4A5',
    accentAmber: '#E27A2D',
  },
  font: {
    serif:   '"Noto Serif JP", "Hiragino Mincho ProN", serif',  // 本文・見出し（読み物）
    sans:    '"Noto Sans JP", -apple-system, system-ui, "Hiragino Kaku Gothic ProN", sans-serif', // UI
    display: '"Bebas Neue", "Oswald", sans-serif',              // ラベル / 数値（コンデンス英字）
    mono:    '"JetBrains Mono", ui-monospace, monospace',       // メタ・日時・コード
  },
  radius: {
    sharp: 2,   // カード・面（紙感を出すため小さい）
    sm: 4,
    pill: 999,  // ボタン・チップは pill
  },
  // 余白は 4 の倍数。シャドウは原則使わず、罫線で面を分ける（noteの落ち着き）
  shadow: {
    card: '0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)',
    pop:  '0 8px 28px rgba(0,0,0,.18)',
    // bluehamham 風の「ハードシャドウ」(フロート要素)
    hard: '4px 4px 0 #1B1A17',
  },
};
```

### フォントのロード
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 4. デザイン思想 — 守ってほしい3つの原則

1. **noteの落ち着きを土台にする**: 背景は `#F0EEE9` のウォーム生成り、本文は Noto Serif JP の17px / line-height 1.95。シャドウは控えめ、罫線で面を区切る。
2. **bluehamham の遊び心を一滴**: Bebas Neue のコンデンス見出し、ピンク `#E84B7C` のアクセント、フロート要素のハードシャドウ (`4px 4px 0 #1B1A17`)、マスコットつむぎの存在感。
3. **AI は黒子**: AIの提案は黄マーカー (`#FFF6BE`) で本文に溶け込ませる。マスコットは批評せず観察した事実だけ伝える口調（「段落が3つ続いていて、少し息が詰まりそう」）。

### 避けるべきこと
- 鮮やかなグラデーション背景
- 絵文字（マスコットがその役）
- 角丸を大きくしすぎる（紙の風合いを残す）
- AIを「魔法」扱いするコピー (「✨AIが書いた！」など)

---

## 5. レイアウトの仕様

### デスクトップ (1280×820 を想定したベース)
- アプリトップバー: 高さ 68px、白背景、下に1px罫線
- メインコンテンツ: 左右パディング 32-48px
- カード: `border: 1px solid rule`、`border-radius: 4px` (紙感)、シャドウは原則使わない

### エディタの3レイアウト
| レイアウト | 列構成 | 用途 |
|---|---|---|
| **2ペイン** | [Outline 220px] [Writing 1fr] | 通常 |
| **集中** | [Writing 1fr (max 12% padding 左右)] | 推敲・没頭 |
| **3カラム** | [Outline 220px] [Writing 1fr] [Preview 320px] | パワーユーザー |

### AIアシスト位置の3パターン
| パターン | 表示形式 | 推奨シーン |
|---|---|---|
| **sidebar** | 右側固定 320px のチャットUI (つむぎとの対話) | 深掘りの執筆 |
| **inline** | 段落間に提案カードを差し込む | 推敲段階 |
| **floating** | 右下にハードシャドウのバブル + マスコット | 通勤・モバイル |

これらは独立した2軸で、9通りの組み合わせが成立する。`editorLayout` と `aiPosition` を別state/別propsで管理すること。

---

## 6. コンポーネント API（このプロトの抽象を踏襲する場合）

```tsx
<Btn kind="primary|ghost|soft|accent|quiet"
     size="sm|md|lg" icon="..." iconRight="..." />
<Chip active accent="..." />
<Icon name="plus|search|sparkle|pen|eye|..." size={18} />
<ImgPlaceholder w h label="MORNING_TABLE.jpg" />  // ストライプ + monospace
<BigNum size={56}>23</BigNum>                       // Bebas Neue タブラー
<SectionHead kicker="DRAFTS · 進行中" title="..." right={...} />
```

### マスコット
```tsx
<Tsumugi size={72} mood="idle|happy|thinking|wink|writing" accent="#E84B7C" />
<TsumugiTiny size={24} accent="#E84B7C" />
```
オリジナル SVG。豆/しずく型の体 + 頭の結び目（"紡ぐ"の意）+ ほっぺ。表情は目とくちのパス差し替えで実装。

---

## 7. エディタの中身 — ProseMirror/Tiptap で組む場合の構造

ドキュメントの JSON 表現:
```json
{
  "title": "コーヒーが冷めるまでの、朝の七分間",
  "subtitle": "小さな儀式が、一日の解像度を上げる",
  "kicker": "ESSAY · COFFEE & MORNINGS",
  "blocks": [
    { "type": "paragraph", "text": "..." },
    { "type": "heading", "level": 2, "text": "余白を埋めない練習", "accent": true },
    { "type": "image", "src": "...", "caption": "朝の机、湯気の立つマグカップ" },
    { "type": "quote", "text": "..." },
    { "type": "ai-suggestion", "kind": "inline", "before": "...", "after": "..." }
  ],
  "tags": ["朝の習慣", "コーヒー", "エッセイ"]
}
```

ゴーストテキスト (AI補完候補) は別ノードタイプ `ghost` として扱い、`Tab` キーで accept、`Esc` で reject にする。

---

## 8. AI 連携の推奨実装 (Vercel AI SDK)

```ts
// app/api/draft/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { theme, tone, length } = await req.json();
  const result = await streamText({
    model: anthropic('claude-haiku-4-5'),
    system: `あなたは「つむぎ」という編集者アシスタントです。
- 観察した事実だけを伝える口調で話す（批評しない）
- noteの読み物として、セリフ書体の手触りを意識した文章を書く
- 段落は3つ続いたら短い一文を挟む`,
    prompt: `テーマ: ${theme}\nトーン: ${tone}\n目標文字数: ${length}\n\n構成案と本文の下書きを生成してください。`,
  });
  return result.toDataStreamResponse();
}
```

クライアント側:
```tsx
const { messages, input, handleSubmit } = useChat({ api: '/api/draft' });
```

つむぎの「気分」(`mood` prop) は、ストリーミング中: `writing` → 完了: `happy` → ユーザー入力待ち: `idle` のように切り替える。

---

## 9. noteへの書き出し戦略

note は公式 API がないため、以下の3経路を実装:
1. **Markdown ダウンロード** (.md)
2. **クリップボードへ HTML コピー** — noteの WYSIWYG エディタにそのまま貼り付け可能な形式に整形 (`<h2>`、`<p>`、`<blockquote>`、画像は URL のみ)
3. **note 下書き JSON エクスポート** (将来の連携拡張用)

タイトル + 見出し + 本文を含む整形済み HTML をクリップボードへ、というのが現実解。

---

## 10. アクセシビリティ

- 本文セリフは 17px / line-height 1.95 を死守
- 配色はすべてコントラスト比 4.5:1 以上 (`ink #1B1A17` on `paper #FFF` = 16.4:1)
- アクセントピンク `#E84B7C` を本文文字色として使わない（背景としてのみ）
- マスコットには `aria-hidden="true"` を付け、装飾扱い
- すべてのボタン・ナビゲーションはキーボード操作可能に
- `prefers-reduced-motion` 対応: フロートAIのアニメーションは reduce 時に静止

---

## 11. 参考ファイル (このプロトのソース)

| ファイル | 役割 |
|---|---|
| `index.html` | エントリ (CDN React/Babel + 各 jsx を読み込み) |
| `app.jsx` | DesignCanvas + TweaksPanel の組み立て、各画面の配置 |
| `shared.jsx` | デザイントークン `T`、Icon、Btn、Chip、WindowChrome、AppTopBar |
| `mascot.jsx` | `<Tsumugi>` / `<TsumugiTiny>` — SVGマスコット (オリジナル) |
| `desktop-screens.jsx` | Dashboard / Editor / Preview のデスクトップ実装 |
| `mobile-screens.jsx` | 同モバイル実装、`<PhoneFrame>` (iOS風) を含む |
| `design-canvas.jsx` | プレビュー用キャンバス (本実装には不要) |
| `tweaks-panel.jsx` | プロト切替用パネル (本実装には不要) |

実装本体に持ち込むべきは `shared.jsx` の `T` トークンと各 Icon/Btn コンポーネント、`mascot.jsx` の SVG、`desktop-screens.jsx` と `mobile-screens.jsx` のレイアウト構造。

---

## 12. 最初のスプリント案 (Claude Code への指示例)

```
このハンドオフを下敷きに Next.js (App Router) + TypeScript + Tiptap でつむぐの本実装を始めてください。

スプリント1:
1. デザイントークンを CSS Modules + CSS変数 で実装
2. Noto Serif JP / Noto Sans JP / Bebas Neue / JetBrains Mono のフォント設定
3. Btn / Chip / Icon / Tsumugi コンポーネントを TypeScript で再実装
4. ダッシュボード画面の静的版（モックデータ）

スプリント2:
5. Tiptap エディタの基本セットアップ（heading, paragraph, image, blockquote）
6. エディタ画面の 2ペイン レイアウト + アウトライン
7. Vercel AI SDK で /api/draft エンドポイント
8. ストリーミング下書き生成のクライアント実装

スプリント3:
9. AIサイドバー (チャットUI)
10. インライン補完 (ゴーストテキスト) と Tab/Esc 操作
11. プレビュー画面
12. クリップボード経由の note 書き出し

各スプリント完了時に動作確認してください。デザイントークンと余白は厳密に守ってください。
```
