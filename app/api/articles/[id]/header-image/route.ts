import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import {
  readJson, writeJson, getArticlePath, getImagesDir, getImagePath,
} from "@/lib/file-storage";
import { ArticleData } from "@/types/article";

// Simple header image upload — no AI placement, just save & link.
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/articles/[id]/header-image">
) {
  const { id } = await ctx.params;
  const article = await readJson<ArticleData>(getArticlePath(id));
  if (!article) {
    return NextResponse.json({ error: "記事が見つかりません" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "ファイルがありません" }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".jpg";
  const filename = `header-${id}-${Date.now()}${ext}`;

  await fs.mkdir(getImagesDir(), { recursive: true });
  await fs.writeFile(getImagePath(filename), Buffer.from(await file.arrayBuffer()));

  const updated: ArticleData = {
    ...article,
    updatedAt: new Date().toISOString(),
    headerImage: filename,
  };
  await writeJson(getArticlePath(id), updated);

  return NextResponse.json({ filename, url: `/api/images/${filename}` });
}
