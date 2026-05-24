"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArticleData, ArticleImage } from "@/types/article";
import { FormatPreview } from "@/components/format/FormatPreview";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Tsumugi } from "@/components/ui/Tsumugi";
import { TsumugiTiny } from "@/components/mascot/TsumugiTiny";
import { Btn } from "@/components/ui/Btn";
import { Chip } from "@/components/ui/Chip";
import { SectionHead } from "@/components/ui/SectionHead";
import { markdownToHtml } from "@/lib/markdown";

type PlacementInfo = { afterHeading: string; altText: string; reason: string };

const NOTE_BODY_CSS = `
.nb {
  font-family: var(--font-serif);
  font-size: 1.0625rem;
  color: var(--color-ink);
  line-height: 2;
}
.nb > * { margin-top: 0; margin-bottom: 0; }
.nb > * + * { margin-top: 1.5rem; }
.nb h1 { display: none; }
.nb h2 {
  font-family: var(--font-serif);
  font-size: 1.375rem;
  font-weight: 500;
  line-height: 1.4;
  margin-top: 3rem;
}
.nb h3 {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.5;
  margin-top: 2rem;
}
.nb h2 + *, .nb h3 + * { margin-top: 0.75rem; }
.nb strong { font-weight: 700; }
.nb em     { font-style: italic; }
.nb p      { font-family: var(--font-serif); }
.nb blockquote {
  border-left: 3px solid var(--color-accent);
  padding-left: 1.25rem;
  margin-left: 0;
  color: var(--color-mute);
}
.nb blockquote p { font-style: italic; }
.nb ul { list-style-type: disc;    padding-left: 1.75rem; }
.nb ol { list-style-type: decimal; padding-left: 1.75rem; }
.nb li { font-family: var(--font-serif); line-height: 2; }
.nb li + li { margin-top: 0.25rem; }
.nb hr {
  border: none;
  border-top: 1px solid var(--color-rule);
  margin: 2.5rem 0;
}
.nb code {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  background: var(--color-surface);
  border: 1px solid var(--color-rule);
  border-radius: 2px;
  padding: 0.1em 0.3em;
}
`;

function getBodyMarkdown(md: string): string {
  const lines = md.split("\n");
  if (lines[0]?.startsWith("# ")) {
    return lines.slice(lines[1] === "" ? 2 : 1).join("\n");
  }
  return md;
}

function calcReadTime(md: string): number {
  const chars = md.replace(/[#*`_>\-\[\]()\n]/g, "").length;
  return Math.max(1, Math.ceil(chars / 500));
}

// ── Header image upload component ────────────────────────────────────────────
function HeaderImageUpload({
  articleId,
  currentImage,
  onUploaded,
}: {
  articleId: string;
  currentImage?: string;
  onUploaded: (filename: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/articles/${articleId}/header-image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "アップロード失敗"); return; }
      onUploaded(data.filename as string);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {currentImage && (
        <div className="relative rounded-sm overflow-hidden border border-rule">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/images/${currentImage}`}
            alt="ヘッダー画像"
            className="w-full h-24 object-cover"
          />
          <span className="absolute bottom-1 right-1 text-[9px] font-mono text-paper bg-ink/60 px-1.5 py-0.5 rounded-sm">
            設定済み
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full border border-dashed border-rule rounded-sm p-4 text-center hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-rule border-t-accent rounded-full animate-spin" />
            <span className="text-[12px] font-sans text-mute">アップロード中…</span>
          </div>
        ) : (
          <div>
            <p className="text-[12px] font-sans text-ink-sub">
              {currentImage ? "画像を変更" : "ヘッダー画像をアップロード"}
            </p>
            <p className="text-[10px] font-mono text-faint mt-0.5">JPG · PNG · WebP</p>
          </div>
        )}
      </button>
      {error && (
        <p className="text-[12px] font-sans text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-sm">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle]           = useState<ArticleData | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);
  const [toast, setToast]               = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/articles/${id}`).then((r) => r.json()).then(setArticle);
  }, [id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
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

  // Work 2: "noteで開く" — copy text + open note new article page
  const handleNoteOpen = async () => {
    if (!article) return;
    const text = article.output.formattedText
      ?? `# ${article.output.selectedTitle}\n\n${article.output.markdown}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("クリップボードにコピーしました。noteの編集画面で貼り付けてください");
    } catch {
      showToast("コピーに失敗しました。下部の「HTMLコピー」を使ってください");
    }
    window.open("https://note.com/notes/new", "_blank");
  };

  // Work 1: header image upload callback
  const handleHeaderImageUploaded = (filename: string) => {
    setArticle((p) => p ? { ...p, headerImage: filename } : p);
    showToast("ヘッダー画像を設定しました");
  };

  // Unused but kept for type compatibility with ImageManager
  const handleImageUploaded = (image: ArticleImage, _suggestion: PlacementInfo) => {
    setArticle((p) => p ? { ...p, images: [...p.images, image] } : p);
  };

  const bodyHtml = useMemo(
    () => (article ? markdownToHtml(getBodyMarkdown(article.output.markdown)) : ""),
    [article]
  );

  if (!article) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const kicker = [
    article.input.genre?.toUpperCase(),
    article.input.theme.slice(0, 28).toUpperCase(),
  ].filter(Boolean).join(" · ");

  const publishedDate = new Date(article.updatedAt).toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric",
  });

  const readTime = calcReadTime(article.output.markdown);

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: NOTE_BODY_CSS }} />

      <div className="min-h-screen bg-bg">

        {/* ── Preview sub-bar ── */}
        <div className="sticky top-[68px] z-30 bg-paper border-b border-rule">
          <div className="max-w-[760px] mx-auto px-5 md:px-6 h-12 flex items-center justify-between gap-3">

            <div className="flex items-center gap-2 min-w-0">
              <Link href="/" className="font-serif text-[20px] leading-none text-ink tracking-[0.04em] hover:opacity-80 transition-opacity shrink-0">
                つむぐ
              </Link>
              <span className="font-display text-[10px] tracking-[0.18em] text-mute leading-none">
                · プレビュー
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-flex">
                <Chip>下書き</Chip>
              </span>
              <Link href={`/editor/${id}`}>
                <Btn kind="ghost" size="sm" icon="pen">エディタ</Btn>
              </Link>
              {/* Work 2: noteで開く — copy + open note.com/notes/new */}
              <Btn
                kind="accent"
                size="sm"
                iconRight="arrow-right"
                onClick={handleNoteOpen}
              >
                noteで開く
              </Btn>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-ink text-paper text-[13px] font-sans px-5 py-2.5 rounded-md shadow-float whitespace-nowrap max-w-[90vw] text-center">
            {toast}
          </div>
        )}

        {/* ── Article area ── */}
        <div className="max-w-[760px] mx-auto px-5 md:px-6 py-10 md:py-14">

          {kicker && (
            <p className="font-mono text-[10px] tracking-[0.2em] text-mute uppercase mb-8">
              {kicker}
            </p>
          )}

          {/* Work 1: header image — shows actual image or placeholder */}
          {article.headerImage ? (
            <div className="w-full aspect-[760/320] rounded-md mb-10 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/images/${article.headerImage}`}
                alt={`${article.output.selectedTitle} のヘッダー画像`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full aspect-[760/320] bg-surface border border-rule rounded-md mb-10 flex flex-col items-center justify-center gap-2 select-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8 text-faint">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className="font-mono text-[10px] tracking-widest text-faint uppercase">
                ヘッダー画像
              </p>
            </div>
          )}

          <h1 className="font-serif text-[2rem] md:text-[2.5rem] font-medium text-ink leading-[1.3] tracking-[0.005em] mb-7">
            {article.output.selectedTitle}
          </h1>

          <div className="flex items-center gap-3 mb-10 pb-8 border-b border-rule">
            <div className="w-10 h-10 rounded-full bg-surface border border-rule flex items-center justify-center shrink-0 overflow-hidden">
              <TsumugiTiny size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-sans font-medium text-ink leading-none">あなた</p>
              <p className="text-[11px] font-mono text-mute mt-1.5 leading-none">
                {publishedDate}&nbsp;·&nbsp;約{readTime}分
              </p>
            </div>
            <Btn kind="ghost" size="sm">フォロー</Btn>
          </div>

          <div className="nb" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

          <div className="mt-16 pt-10 border-t border-rule flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface border border-rule flex items-center justify-center shrink-0">
              <Tsumugi size={20} mood="happy" />
            </div>
            <div>
              <p className="text-[12px] font-sans font-medium text-ink">あなた</p>
              <p className="text-[11px] font-sans text-mute">つむぐで書きました</p>
            </div>
          </div>
        </div>

        {/* ── NOTE 準備ツール ── */}
        <div className="border-t border-rule bg-surface">
          <div className="max-w-[760px] mx-auto px-5 md:px-6 py-10">
            <SectionHead
              kicker="NOTE 準備ツール"
              title="貼り付け前の最終仕上げ"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <Card kicker="FORMAT" title="整形・コピー">
                  <FormatPreview
                    article={article}
                    onFormat={handleFormat}
                    onCopied={handleCopied}
                    isFormatting={isFormatting}
                  />
                </Card>
              </div>

              <div className="space-y-5">
                {/* Work 1: header image upload */}
                <Card kicker="HEADER" title="ヘッダー画像">
                  <p className="text-[12px] font-sans text-mute mb-3 leading-relaxed">
                    プレビュー上部に表示するヘッダー画像を設定します。
                  </p>
                  <HeaderImageUpload
                    articleId={id}
                    currentImage={article.headerImage}
                    onUploaded={handleHeaderImageUploaded}
                  />
                </Card>

                {article.status === "copied" && (
                  <div className="flex flex-col items-center gap-3 py-6 text-center bg-paper border border-rule rounded-sm">
                    <Tsumugi size={52} mood="happy" />
                    <p className="text-sm font-serif text-mute">noteに貼り付け準備完了！</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
