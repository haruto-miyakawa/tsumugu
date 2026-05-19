import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readJson, writeJson, getArticlePath } from "@/lib/file-storage";
import { ArticleData } from "@/types/article";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/articles/[id]">) {
  const { id } = await ctx.params;
  const article = await readJson<ArticleData>(getArticlePath(id));
  if (!article) return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/articles/[id]">) {
  const { id } = await ctx.params;
  const article = await readJson<ArticleData>(getArticlePath(id));
  if (!article) return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });

  const body = await request.json() as {
    selectedTitle?: string;
    status?: ArticleData["status"];
    markdown?: string;
  };

  let output = { ...article.output };
  if (body.selectedTitle !== undefined) output = { ...output, selectedTitle: body.selectedTitle };
  if (body.markdown !== undefined) output = { ...output, markdown: body.markdown };

  const updated: ArticleData = {
    ...article,
    updatedAt: new Date().toISOString(),
    output,
    ...(body.status !== undefined && { status: body.status }),
  };

  await writeJson(getArticlePath(id), updated);
  return NextResponse.json(updated);
}
