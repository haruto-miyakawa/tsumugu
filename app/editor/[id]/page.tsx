import { notFound } from "next/navigation";
import { readJson, getArticlePath } from "@/lib/file-storage";
import { ArticleData } from "@/types/article";
import { EditorShell } from "@/components/editor/EditorShell";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await readJson<ArticleData>(getArticlePath(id));
  if (!article) notFound();
  return <EditorShell article={article} />;
}
