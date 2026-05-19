"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GenerateRequest, ApiError } from "@/types/api";
import { ArticleData } from "@/types/article";
import { GenerateForm } from "@/components/generate/GenerateForm";
import { ArticleResult } from "@/components/generate/ArticleResult";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Tsumugi } from "@/components/ui/Tsumugi";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Inner component that uses useSearchParams — must be inside <Suspense>
function GeneratePageContent() {
  const searchParams = useSearchParams();
  const defaultTheme = searchParams.get("theme") ?? "";

  const [isLoading, setIsLoading] = useState(false);
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (req: GenerateRequest) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      const data = (await res.json()) as ArticleData | ApiError;
      if (!res.ok) {
        setError((data as ApiError).error ?? "生成に失敗しました");
        return;
      }
      setArticle(data as ArticleData);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = async (title: string) => {
    if (!article) return;
    await fetch(`/api/articles/${article.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedTitle: title }),
    });
    setArticle((prev) =>
      prev ? { ...prev, output: { ...prev.output, selectedTitle: title } } : prev
    );
  };

  return (
    <PageContainer kicker="EDITOR" title="記事を生成する">
      <div className="max-w-2xl">
        {article ? (
          <Card kicker="GENERATED" title="生成完了">
            <ArticleResult article={article} onTitleChange={handleTitleChange} />
          </Card>
        ) : (
          <Card kicker="INPUT" title="素材を入力">
            {error && (
              <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2.5 rounded-sm">
                {error}
              </p>
            )}
            {isLoading ? (
              <div className="py-16 flex flex-col items-center gap-5">
                <Tsumugi size={72} mood="writing" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-ink">つむぎが記事を書いています</p>
                  <p className="text-xs text-mute">30秒〜1分かかる場合があります...</p>
                </div>
              </div>
            ) : (
              <GenerateForm
                onSubmit={handleGenerate}
                isLoading={isLoading}
                defaultTheme={defaultTheme}
              />
            )}
          </Card>
        )}
      </div>
    </PageContainer>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <PageContainer kicker="EDITOR" title="記事を生成する">
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        </PageContainer>
      }
    >
      <GeneratePageContent />
    </Suspense>
  );
}
