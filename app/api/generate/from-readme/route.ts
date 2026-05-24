import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  GENRES,
  TONES,
  STRUCTURES,
  LENGTH_PREFERENCES,
  PLATFORMS,
  type FromReadmeResponse,
} from "@/types/from-readme";
import { PLATFORM_CONFIGS } from "@/lib/platforms";

const client = new Anthropic();

// 2000字未満は Haiku 要約をスキップして Sonnet に直接渡す（短文の水増しを避ける）。
const HAIKU_THRESHOLD = 2000;
// README の絶対上限。リクエスト Zod で弾く。フロントの 100k と整合。
const README_MAX_CHARS = 100_000;
// Haiku に投げる時の上限。極端な長文を Haiku で削る前に物理的に切る。
const HAIKU_INPUT_LIMIT = 60_000;

// ─── Zod スキーマ（リクエスト＆ tool_use 結果） ──────────────────────────────
const RequestSchema = z.object({
  source: z.object({
    type: z.literal("text"),
    readmeText: z.string().min(1).max(README_MAX_CHARS),
  }),
  platform: z.enum(PLATFORMS),
});

const ResponseSchema = z.object({
  theme: z.string().min(1),
  episode: z.string(),
  genre: z.enum(GENRES),
  tone: z.enum(TONES),
  structure: z.enum(STRUCTURES),
  lengthPreference: z.enum(LENGTH_PREFERENCES),
  targetReader: z.string(),
  additionalNotes: z.string(),
});

// ─── Sonnet の tool 定義 ───────────────────────────────────────────────────
const FROM_README_TOOL: Anthropic.Tool = {
  name: "extract_article_seeds",
  description: "READMEから記事生成用の素材を抽出する",
  input_schema: {
    type: "object" as const,
    properties: {
      theme: {
        type: "string",
        description: "記事のテーマ（1行、30字以内）",
      },
      episode: {
        type: "string",
        description: "エピソード・ネタ（自由記述、200字以内）",
      },
      genre: { type: "string", enum: [...GENRES] },
      tone: { type: "string", enum: [...TONES] },
      structure: { type: "string", enum: [...STRUCTURES] },
      lengthPreference: { type: "string", enum: [...LENGTH_PREFERENCES] },
      targetReader: {
        type: "string",
        description: "想定読者（自由記述、60字以内）",
      },
      additionalNotes: {
        type: "string",
        description: "追加メモ（自由記述、120字以内）",
      },
    },
    required: [
      "theme",
      "episode",
      "genre",
      "tone",
      "structure",
      "lengthPreference",
      "targetReader",
      "additionalNotes",
    ],
  },
};

// ─── Haiku: 長文 README を要約 ─────────────────────────────────────────────
async function summarizeWithHaiku(readmeText: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `このREADMEを2000字以内に要約してください。
記事化のために以下を残してください:
- コンセプト
- 技術選定の理由
- 苦労した点
- 解決した課題
- 想定読者

【重要】READMEに書かれていない情報は絶対に追加しないでください。

<readme>
${readmeText.slice(0, HAIKU_INPUT_LIMIT)}
</readme>`,
      },
    ],
  });

  const firstBlock = message.content[0];
  if (!firstBlock || firstBlock.type !== "text") {
    throw new Error("haiku_no_text");
  }
  return firstBlock.text.trim();
}

// ─── ハンドラ ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    // リクエスト検証
    const raw = await request.json();
    const parsed = RequestSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "リクエスト形式が正しくありません" },
        { status: 400 }
      );
    }
    const { source, platform } = parsed.data;
    const readmeText = source.readmeText;

    // Haiku を通すかどうか（短文はそのまま Sonnet へ）
    const inputForSonnet =
      readmeText.length >= HAIKU_THRESHOLD
        ? await summarizeWithHaiku(readmeText)
        : readmeText;

    // プラットフォーム別 system prompt
    const config = PLATFORM_CONFIGS[platform];

    // Sonnet で tool_use 構造化抽出
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: config.systemPrompt,
      tools: [FROM_README_TOOL],
      tool_choice: { type: "any" },
      messages: [
        {
          role: "user",
          content: `以下のREADMEから、${config.label}を書くための素材を抽出してください。

<readme${readmeText.length >= HAIKU_THRESHOLD ? "_summary" : ""}>
${inputForSonnet}
</readme${readmeText.length >= HAIKU_THRESHOLD ? "_summary" : ""}>`,
        },
      ],
    });

    const toolUse = message.content.find((c) => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json(
        { error: "解析に失敗しました（tool_use なし）" },
        { status: 500 }
      );
    }

    // ランタイム検証（LLM が enum 外を返したらここで弾く）
    const validated = ResponseSchema.safeParse(toolUse.input);
    if (!validated.success) {
      console.error("FromReadme tool_use schema mismatch:", validated.error);
      return NextResponse.json(
        { error: "解析結果の形式が想定外でした。もう一度お試しください。" },
        { status: 500 }
      );
    }

    const response: FromReadmeResponse = validated.data;
    return NextResponse.json(response);
  } catch (e) {
    console.error("FromReadme error:", e);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
