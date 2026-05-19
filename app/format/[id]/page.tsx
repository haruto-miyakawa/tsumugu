"use client";
import { use, useEffect, useState } from "react";
import { ArticleData, ArticleImage } from "@/types/article";
import { FormatPreview } from "@/components/format/FormatPreview";
import { ImageManager } from "@/components/format/ImageManager";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Tsumugi } from "@/components/ui/Tsumugi";

type PlacementInfo = { afterHeading: string; altText: string; reason: string };

const STATUS_LABEL = { draft: "下書き", formatted: "整形済み", copied: "コピー済み" } as const;
const STATUS_CLASS = {
  draft: "bg-surface text-mute",
  formatted: "bg-highlight text-ink-soft",
  copied: "bg-surface2 text-ink",
} as const;

export default function FormatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/articles/${id}`).then((r) => r.json()).then(setArticle);
  }, [id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormat = async () => {
    setIsFormatting(true);
    try {
      const res = await fetch(`/api/articles/${id}/format`, { method: "POST" });
      setArticle(await res.json() as ArticleData);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopied = async () => {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "copied" }),
    });
    setArticle((p) => p ? { ...p, status: "copied" } : p);
    showToast("クリップボードにコピーしました");
  };

  const handleImageUploaded = (image: ArticleImage, suggestion: PlacementInfo) => {
    setArticle((p) => p ? { ...p, images: [...p.images, image] } : p);
    showToast(`「${image.originalName}」→「${suggestion.afterHeading}」の後に配置提案しました`);
  };

  if (!article) {
    return (
      <PageContainer kicker="LIBRARY" title="整形・プレビュー">
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      </PageContainer>
    );
  }

  return (
    <PageContainer kicker="LIBRARY">
      {toast && (
        <div
          className="mb-4 px-4 py-2.5 bg-highlight border border-rule text-ink text-sm"
          style={{ borderRadius: "4px" }}
        >
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Article meta */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`text-[10px] px-2 py-1 font-mono ${STATUS_CLASS[article.status]}`}
              style={{ borderRadius: "2px" }}
            >
              {STATUS_LABEL[article.status]}
            </span>
            <span className="text-xs text-mute font-mono">{article.input.theme}</span>
            <span className="text-xs text-mute-soft font-mono">
              {new Date(article.createdAt).toLocaleDateString("ja-JP")}
            </span>
          </div>

          <Card kicker="FORMAT" title="整形・コピー">
            <FormatPreview
              article={article}
              onFormat={handleFormat}
              onCopied={handleCopied}
              isFormatting={isFormatting}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card kicker="IMAGES" title="画像配置">
            <p className="text-sm text-mute mb-4 leading-relaxed">
              画像をアップロードするとAIが最適な配置場所を提案します。
            </p>
            <ImageManager article={article} onImageUploaded={handleImageUploaded} />
          </Card>

          {article.status === "copied" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center bg-paper border border-rule" style={{ borderRadius: "4px" }}>
              <Tsumugi size={56} mood="happy" />
              <p className="text-sm text-mute">noteに貼り付け準備完了！</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
