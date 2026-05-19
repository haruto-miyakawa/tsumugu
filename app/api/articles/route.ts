import { NextResponse } from "next/server";
import { readJson, listArticleFiles, getArticlePath } from "@/lib/file-storage";
import { ArticleData, ArticleSummary } from "@/types/article";

export async function GET() {
  const files = await listArticleFiles();
  const summaries: ArticleSummary[] = [];

  for (const file of files.slice(0, 10)) {
    const id = file.replace(".json", "");
    const article = await readJson<ArticleData>(getArticlePath(id));
    if (article) {
      summaries.push({
        id: article.id,
        title: article.output.selectedTitle,
        theme: article.input.theme,
        createdAt: article.createdAt,
        status: article.status,
      });
    }
  }

  return NextResponse.json(summaries);
}
