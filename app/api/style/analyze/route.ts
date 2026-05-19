import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { StyleConfig, DEFAULT_STYLE } from "@/types/style";
import { StyleAnalyzeRequest } from "@/types/api";

const client = new Anthropic();

const ANALYZE_TOOL: Anthropic.Tool = {
  name: "extract_style",
  description: "Extracts writing style from the given Japanese article text",
  input_schema: {
    type: "object" as const,
    properties: {
      tone: {
        type: "object",
        properties: {
          formality: { type: "string", enum: ["casual", "neutral", "formal"] },
          humor: { type: "string", enum: ["none", "light", "frequent"] },
          perspective: { type: "string", enum: ["first_person", "third_person", "mixed"] },
          enthusiasm: { type: "string", enum: ["restrained", "moderate", "high"] },
          description: { type: "string", description: "50字以内で文体の特徴を日本語で説明" },
        },
        required: ["formality", "humor", "perspective", "enthusiasm", "description"],
      },
      structure: {
        type: "object",
        properties: {
          opening: { type: "string", enum: ["hook", "question", "anecdote", "direct"] },
          closing: { type: "string", enum: ["summary", "cta", "question", "reflection"] },
          headingFrequency: { type: "string", enum: ["few", "moderate", "many"] },
          paragraphLength: { type: "string", enum: ["short", "medium", "long"] },
          usesBulletPoints: { type: "boolean" },
          usesNumberedLists: { type: "boolean" },
          typicalSections: {
            type: "array",
            items: { type: "string" },
            description: "典型的なセクション名（例: 背景、学び、まとめ）",
          },
        },
        required: ["opening", "closing", "headingFrequency", "paragraphLength", "usesBulletPoints", "usesNumberedLists", "typicalSections"],
      },
      vocabulary: {
        type: "object",
        properties: {
          preferredExpressions: {
            type: "array",
            items: { type: "string" },
            description: "よく使う表現・口癖（3〜5個）",
          },
          avoidedExpressions: {
            type: "array",
            items: { type: "string" },
            description: "使っていないと思われる表現",
          },
          jargonLevel: { type: "string", enum: ["none", "some", "heavy"] },
          emojiUsage: { type: "string", enum: ["none", "minimal", "frequent"] },
        },
        required: ["preferredExpressions", "avoidedExpressions", "jargonLevel", "emojiUsage"],
      },
      noteSpecific: {
        type: "object",
        properties: {
          targetLength: { type: "number", description: "この記事の文字数に近い値" },
          hashTags: {
            type: "array",
            items: { type: "string" },
            description: "記事に合いそうなハッシュタグ（#なし、3〜5個）",
          },
          categoryHint: { type: "string", description: "記事のカテゴリー（例: エンジニアリング、日常、ビジネス）" },
        },
        required: ["targetLength", "hashTags", "categoryHint"],
      },
    },
    required: ["tone", "structure", "vocabulary", "noteSpecific"],
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json() as StyleAnalyzeRequest;

    if (!body.text || body.text.trim().length < 100) {
      return NextResponse.json(
        { error: "記事テキストは100文字以上入力してください" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      tools: [ANALYZE_TOOL],
      tool_choice: { type: "any" },
      messages: [
        {
          role: "user",
          content: `以下のnote記事を読んで、筆者の文体・スタイルを解析してください。

<article>
${body.text.slice(0, 8000)}
</article>

extract_styleツールを使って解析結果を返してください。`,
        },
      ],
    });

    const toolUse = message.content.find((c) => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json({ error: "解析に失敗しました" }, { status: 500 });
    }

    const extracted = toolUse.input as Omit<StyleConfig, "version" | "updatedAt">;
    const result: StyleConfig = {
      ...DEFAULT_STYLE,
      ...extracted,
      version: 1,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error("Style analyze error:", e);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
