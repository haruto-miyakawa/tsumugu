import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readJson, writeJson, getStylePath, getArticlePath } from "@/lib/file-storage";
import { ArticleData } from "@/types/article";
import { StyleConfig, DEFAULT_STYLE } from "@/types/style";

export async function POST(_req: NextRequest, ctx: RouteContext<"/api/articles/[id]/format">) {
  const { id } = await ctx.params;
  const article = await readJson<ArticleData>(getArticlePath(id));
  if (!article) return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });

  const style = (await readJson<StyleConfig>(getStylePath())) ?? DEFAULT_STYLE;

  const hashtags =
    style.noteSpecific.hashTags.length > 0
      ? "\n\n" + style.noteSpecific.hashTags.map((t) => `#${t}`).join(" ")
      : "";

  const formattedText = `${article.output.markdown}${hashtags}`;

  const updated: ArticleData = {
    ...article,
    updatedAt: new Date().toISOString(),
    output: { ...article.output, formattedText },
    status: "formatted",
  };

  await writeJson(getArticlePath(id), updated);
  return NextResponse.json(updated);
}
