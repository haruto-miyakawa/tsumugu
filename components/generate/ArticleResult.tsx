"use client";
import { useState } from "react";
import Link from "next/link";
import { ArticleData } from "@/types/article";
import { Button } from "@/components/ui/Button";

interface ArticleResultProps {
  article: ArticleData;
  onTitleChange: (title: string) => Promise<void>;
}

export function ArticleResult({ article, onTitleChange }: ArticleResultProps) {
  const [selectedTitle, setSelectedTitle] = useState(article.output.selectedTitle);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleTitleSelect = async (title: string) => {
    if (title === selectedTitle) return;
    setSelectedTitle(title);
    setIsUpdating(true);
    try {
      await onTitleChange(title);
    } finally {
      setIsUpdating(false);
    }
  };

  const charCount = article.output.markdown.replace(/[#*`_>\-\[\]()]/g, "").replace(/\n+/g, "\n").length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          タイトルを選択
          {isUpdating && <span className="ml-2 text-xs text-gray-400 font-normal">保存中...</span>}
        </h3>
        <div className="space-y-2">
          {article.output.titleCandidates.map((title, i) => (
            <button
              key={i}
              onClick={() => handleTitleSelect(title)}
              disabled={isUpdating}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                selectedTitle === title
                  ? "border-blue-500 bg-blue-50 text-blue-900 font-medium"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
              }`}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">生成された記事</h3>
          <span className="text-xs text-gray-400">約 {charCount.toLocaleString()} 字</span>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed max-h-96 overflow-y-auto">
          {article.output.markdown}
        </pre>
      </div>

      <div className="flex gap-3">
        <Link href={`/format/${article.id}`}>
          <Button>整形・プレビューへ →</Button>
        </Link>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          別の記事を生成
        </Button>
      </div>
    </div>
  );
}
