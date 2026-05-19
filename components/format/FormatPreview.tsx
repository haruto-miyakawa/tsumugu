"use client";
import { useState } from "react";
import { ArticleData } from "@/types/article";
import { Button } from "@/components/ui/Button";

interface FormatPreviewProps {
  article: ArticleData;
  onFormat: () => Promise<void>;
  onCopied: () => Promise<void>;
  isFormatting: boolean;
}

function mdToNoteHtml(md: string): string {
  return md
    .split("\n\n")
    .map((block) => {
      const b = block.trim();
      if (!b) return "";
      if (b.startsWith("## ")) return `<h2>${b.slice(3)}</h2>`;
      if (b.startsWith("### ")) return `<h3>${b.slice(4)}</h3>`;
      if (b.startsWith("> ")) return `<blockquote><p>${b.slice(2)}</p></blockquote>`;
      const inline = b
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
      return `<p>${inline}</p>`;
    })
    .join("\n");
}

function downloadMd(article: ArticleData) {
  const content = `# ${article.output.selectedTitle}\n\n${article.output.markdown}`;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${article.output.selectedTitle.slice(0, 40).replace(/[/\\?%*:|"<>]/g, "-")}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function FormatPreview({ article, onFormat, onCopied, isFormatting }: FormatPreviewProps) {
  const [copiedField, setCopiedField] = useState<"title" | "body" | null>(null);

  const copyText = async (text: string, field: "title" | "body", asHtml?: boolean) => {
    if (asHtml && field === "body") {
      const html = mdToNoteHtml(text);
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
      } catch {
        await navigator.clipboard.writeText(text);
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    if (field === "body") await onCopied();
  };

  const hasFormatted = !!article.output.formattedText;
  const charCount = hasFormatted
    ? article.output.formattedText!.replace(/[#*`_>\-\[\]()]/g, "").replace(/\n+/g, "\n").length
    : 0;

  if (!hasFormatted) {
    return (
      <div className="py-10 flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-mute">整形するとハッシュタグが追加され、noteへの貼り付け用HTMLが生成されます。</p>
        <Button onClick={onFormat} isLoading={isFormatting}>整形する</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono tracking-widest text-mute uppercase">タイトル</p>
          <button
            onClick={() => copyText(article.output.selectedTitle, "title")}
            className="text-xs text-mute hover:text-ink transition-colors px-2 py-1 hover:bg-surface rounded-full"
          >
            {copiedField === "title" ? "コピーしました ✓" : "コピー"}
          </button>
        </div>
        <div className="bg-surface border border-rule px-4 py-3 text-sm font-medium text-ink" style={{ borderRadius: "4px" }}>
          {article.output.selectedTitle}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono tracking-widest text-mute uppercase">
            本文
            <span className="ml-2 normal-case font-sans text-mute-soft">約 {charCount.toLocaleString()} 字</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => downloadMd(article)}
              className="text-xs text-mute hover:text-ink transition-colors px-2 py-1 hover:bg-surface rounded-full"
            >
              .md ↓
            </button>
            <button
              onClick={() => copyText(article.output.formattedText!, "body", true)}
              className="text-xs text-mute hover:text-ink transition-colors px-2 py-1 hover:bg-surface rounded-full"
            >
              {copiedField === "body" ? "コピーしました ✓" : "HTMLコピー"}
            </button>
          </div>
        </div>
        <pre
          className="bg-surface border border-rule p-4 text-sm text-ink whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto"
          style={{ fontFamily: "var(--font-serif)", borderRadius: "4px" }}
        >
          {article.output.formattedText}
        </pre>
      </div>
    </div>
  );
}
