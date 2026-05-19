import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { StyleConfig, DEFAULT_STYLE } from "@/types/style";
import { GenerateRequest } from "@/types/api";
import { ArticleData } from "@/types/article";
import { readJson, writeJson, getStylePath, getArticlePath } from "@/lib/file-storage";

const client = new Anthropic();

function buildStyleDescription(style: StyleConfig): string {
  const parts: string[] = [];

  const formality = { casual: "カジュアル", neutral: "ニュートラル", formal: "フォーマル" }[style.tone.formality];
  const humor = { none: "ユーモアなし", light: "ほんのりユーモアあり", frequent: "ユーモア多め" }[style.tone.humor];
  const perspective = { first_person: "一人称（私・僕など）", third_person: "三人称", mixed: "一人称・三人称混在" }[style.tone.perspective];
  const enthusiasm = { restrained: "落ち着いたトーン", moderate: "普通のテンション", high: "ハイテンション" }[style.tone.enthusiasm];
  parts.push(`文体: ${formality}、${humor}、${perspective}、${enthusiasm}`);
  if (style.tone.description) parts.push(`特徴: ${style.tone.description}`);

  const opening = { hook: "フック（読者を引きつける書き出し）", question: "問いかけ", anecdote: "エピソード", direct: "直接的な結論" }[style.structure.opening];
  const closing = { summary: "まとめ", cta: "行動を促すCTA", question: "問いかけ", reflection: "振り返り" }[style.structure.closing];
  const headings = { few: "見出しは少なめ", moderate: "見出しは適度に", many: "見出しは多め" }[style.structure.headingFrequency];
  const paragraphs = { short: "段落は短め（2〜3文）", medium: "段落は標準（3〜5文）", long: "段落は長め（5文以上）" }[style.structure.paragraphLength];
  parts.push(`構成: 書き出しは${opening}。締めは${closing}。${headings}。${paragraphs}。`);

  if (style.structure.usesBulletPoints) parts.push("箇条書きを積極的に使う。");
  else parts.push("箇条書きは使わない。");
  if (style.structure.usesNumberedLists) parts.push("番号付きリストを使う。");
  if (style.structure.typicalSections.length > 0) {
    parts.push(`典型的なセクション: ${style.structure.typicalSections.join(" → ")}`);
  }

  const emoji = { none: "絵文字は使わない", minimal: "絵文字は控えめに", frequent: "絵文字をよく使う" }[style.vocabulary.emojiUsage];
  const jargon = { none: "専門用語は使わない", some: "専門用語は少し使う", heavy: "専門用語を多く使う" }[style.vocabulary.jargonLevel];
  parts.push(`語彙: ${emoji}。${jargon}。`);
  if (style.vocabulary.preferredExpressions.length > 0) {
    parts.push(`よく使う表現: ${style.vocabulary.preferredExpressions.join("、")}`);
  }
  if (style.vocabulary.avoidedExpressions.length > 0) {
    parts.push(`使わない表現: ${style.vocabulary.avoidedExpressions.join("、")}`);
  }

  return parts.join("\n");
}

const GENERATE_TOOL: Anthropic.Tool = {
  name: "generate_article",
  description: "noteの記事を生成する",
  input_schema: {
    type: "object" as const,
    properties: {
      titleCandidates: {
        type: "array",
        items: { type: "string" },
        description: "タイトル候補3つ（読者を引きつける魅力的なもの）",
      },
      markdown: {
        type: "string",
        description: "記事本文（Markdown形式。見出しは##、###を使用）",
      },
    },
    required: ["titleCandidates", "markdown"],
  },
};

const LENGTH_CHARS: Record<string, number> = { short: 1000, medium: 2000, long: 3500 };

export async function POST(request: Request) {
  try {
    const body = await request.json() as GenerateRequest;
    if (!body.theme?.trim() || !body.episode?.trim()) {
      return NextResponse.json({ error: "テーマとエピソードは必須です" }, { status: 400 });
    }

    const style = (await readJson<StyleConfig>(getStylePath())) ?? DEFAULT_STYLE;
    const targetChars = LENGTH_CHARS[body.lengthPreference ?? "medium"];

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      tools: [GENERATE_TOOL],
      tool_choice: { type: "any" },
      messages: [{
        role: "user",
        content: `あなたはnoteクリエイターのゴーストライターです。筆者のスタイルを完全に再現して記事を書いてください。

## 筆者のスタイル設定
${buildStyleDescription(style)}
${body.genre ? `\nジャンル: ${body.genre}` : ""}${body.tone ? `\n口調: ${body.tone}` : ""}${body.structure ? `\n構成: ${body.structure}` : ""}

## 記事の素材
- テーマ: ${body.theme}
- エピソード・ネタ: ${body.episode}
${body.targetReader ? `- ターゲット読者: ${body.targetReader}` : ""}
- 目標文字数: ${targetChars}字前後
${body.additionalNotes ? `- 追加メモ: ${body.additionalNotes}` : ""}

generate_articleツールで、タイトル候補3つと本文（Markdown）を返してください。`,
      }],
    });

    const toolUse = message.content.find((c) => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json({ error: "生成に失敗しました" }, { status: 500 });
    }

    const generated = toolUse.input as { titleCandidates: string[]; markdown: string };
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const article: ArticleData = {
      id,
      createdAt: now,
      updatedAt: now,
      input: {
        theme: body.theme,
        episode: body.episode,
        targetReader: body.targetReader,
        lengthPreference: body.lengthPreference,
        additionalNotes: body.additionalNotes,
        genre: body.genre,
        tone: body.tone,
        structure: body.structure,
      },
      output: {
        selectedTitle: generated.titleCandidates[0] ?? "",
        titleCandidates: generated.titleCandidates,
        markdown: generated.markdown,
      },
      images: [],
      status: "draft",
    };

    await writeJson(getArticlePath(id), article);
    return NextResponse.json(article);
  } catch (e) {
    console.error("Generate error:", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
