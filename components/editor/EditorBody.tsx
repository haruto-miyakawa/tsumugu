"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArticleData } from "@/types/article";
import { EditorUpdateData } from "@/types/editor";
import { markdownToHtml } from "@/lib/markdown";
import type { Editor } from "@tiptap/react";

const RichEditor = dynamic(
  () => import("./RichEditor").then((m) => m.RichEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-paper">
        <div className="w-5 h-5 rounded-full border-2 border-rule border-t-accent animate-spin" />
      </div>
    ),
  }
);

interface Props {
  article: ArticleData;
  isMobile?: boolean;
  onUpdate: (data: EditorUpdateData) => void;
  onEditorReady?: (editor: Editor) => void;
  onAiFocus?: () => void;
}

export function EditorBody({ article, isMobile, onUpdate, onEditorReady, onAiFocus }: Props) {
  const [initialHtml] = useState(() => markdownToHtml(article.output.markdown));

  const kicker = [
    article.input.genre?.toUpperCase(),
    article.input.theme.slice(0, 28).toUpperCase(),
  ].filter(Boolean).join(" · ");

  const date = new Date(article.updatedAt).toLocaleDateString("ja-JP", {
    year: "numeric", month: "long", day: "numeric",
  });

  const tags = [article.input.genre, "#つむぐで書いた"].filter(
    (t): t is string => Boolean(t)
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-paper overflow-hidden">
      <RichEditor
        initialHtml={initialHtml}
        kicker={kicker}
        date={date}
        tags={tags}
        isMobile={isMobile}
        onUpdate={onUpdate}
        onEditorReady={onEditorReady}
        onAiFocus={onAiFocus}
      />
    </div>
  );
}
