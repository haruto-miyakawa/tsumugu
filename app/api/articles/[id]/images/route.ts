import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import {
  readJson,
  writeJson,
  getArticlePath,
  getImagesDir,
  getImagePath,
} from "@/lib/file-storage";
import { ArticleData } from "@/types/article";

const client = new Anthropic();

function extractHeadings(markdown: string): string[] {
  return markdown
    .split("\n")
    .filter((line) => /^#{2,3}\s/.test(line))
    .map((line) => line.replace(/^#{2,3}\s+/, ""));
}

async function suggestPlacement(
  originalName: string,
  headings: string[],
  articleTheme: string
): Promise<{ afterHeading: string; altText: string; reason: string }> {
  if (headings.length === 0) {
    return { afterHeading: "冒頭", altText: originalName, reason: "見出しがないため冒頭に配置" };
  }

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    tools: [
      {
        name: "suggest_placement",
        description: "画像の配置場所を提案する",
        input_schema: {
          type: "object" as const,
          properties: {
            afterHeading: {
              type: "string",
              description: `配置する見出し名（${headings.join("、")} のいずれかを正確に）`,
            },
            altText: {
              type: "string",
              description: "画像のaltテキスト（日本語、30字以内）",
            },
            reason: {
              type: "string",
              description: "配置理由（日本語、50字以内）",
            },
          },
          required: ["afterHeading", "altText", "reason"],
        },
      },
    ],
    tool_choice: { type: "any" },
    messages: [
      {
        role: "user",
        content: `記事テーマ「${articleTheme}」の画像「${originalName}」を以下の見出しのどこに配置するか提案してください。

見出し: ${headings.join("、")}

suggest_placementツールで回答してください。`,
      },
    ],
  });

  const toolUse = message.content.find((c) => c.type === "tool_use");
  if (toolUse && toolUse.type === "tool_use") {
    return toolUse.input as { afterHeading: string; altText: string; reason: string };
  }
  return { afterHeading: headings[0], altText: originalName, reason: "先頭の見出し後に配置" };
}

export async function POST(request: NextRequest, ctx: RouteContext<"/api/articles/[id]/images">) {
  const { id } = await ctx.params;
  const article = await readJson<ArticleData>(getArticlePath(id));
  if (!article) return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}${ext}`;
  const imagesDir = getImagesDir();
  await fs.mkdir(imagesDir, { recursive: true });
  await fs.writeFile(getImagePath(filename), Buffer.from(await file.arrayBuffer()));

  const headings = extractHeadings(article.output.markdown);
  const suggestion = await suggestPlacement(file.name, headings, article.input.theme);

  const imageEntry = {
    filename,
    originalName: file.name,
    placementAfter: suggestion.afterHeading,
    altText: suggestion.altText,
  };

  const updated: ArticleData = {
    ...article,
    updatedAt: new Date().toISOString(),
    images: [...article.images, imageEntry],
  };

  await writeJson(getArticlePath(id), updated);
  return NextResponse.json({ image: imageEntry, suggestion });
}
