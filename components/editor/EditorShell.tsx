"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArticleData } from "@/types/article";
import { EditorHeading, EditorUpdateData, SaveStatus } from "@/types/editor";
import { htmlToMarkdown } from "@/lib/markdown";
import { EditorNavbar } from "./EditorNavbar";
import { OutlinePanel } from "./OutlinePanel";
import { EditorBody } from "./EditorBody";
import { AiPanel } from "./AiPanel";

type MobileTab = "body" | "outline" | "ai";

interface Props {
  article: ArticleData;
}

const AUTOSAVE_DELAY = 2000;

export function EditorShell({ article }: Props) {
  const [mobileTab, setMobileTab] = useState<MobileTab>("body");

  // Lifted state — updated by RichEditor via onUpdate
  const [charCount, setCharCount] = useState(article.output.markdown.length);
  const [headings, setHeadings] = useState<EditorHeading[]>(() =>
    extractHeadings(article.output.markdown)
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  // Refs for auto-save without causing re-renders
  const latestHtmlRef = useRef<string>("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleEditorUpdate = useCallback(
    (data: EditorUpdateData) => {
      latestHtmlRef.current = data.html;
      setCharCount(data.charCount);
      setHeadings(data.headings);
      setSaveStatus("unsaved");

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        if (!isMountedRef.current) return;
        setSaveStatus("saving");
        try {
          const md = htmlToMarkdown(latestHtmlRef.current);
          await fetch(`/api/articles/${article.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ markdown: md }),
          });
          if (!isMountedRef.current) return;
          setSaveStatus("saved");
        } catch {
          if (!isMountedRef.current) return;
          setSaveStatus("unsaved");
        }
      }, AUTOSAVE_DELAY);
    },
    [article.id]
  );

  return (
    // 68px = Header height
    <div className="flex flex-col h-[calc(100dvh-68px)]">
      <EditorNavbar
        title={article.output.selectedTitle}
        charCount={charCount}
        articleId={article.id}
        status={article.status}
        saveStatus={saveStatus}
      />

      {/* ── Desktop: 3-column grid ── */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden">
        <OutlinePanel headings={headings} />
        <EditorBody article={article} onUpdate={handleEditorUpdate} />
        <AiPanel />
      </div>

      {/* ── Mobile: single column + bottom tab switcher ── */}
      <div className="flex flex-col flex-1 min-h-0 lg:hidden">
        <div className="flex-1 overflow-y-auto">
          {mobileTab === "body"    && <EditorBody article={article} isMobile onUpdate={handleEditorUpdate} />}
          {mobileTab === "outline" && <OutlinePanel headings={headings} isMobile />}
          {mobileTab === "ai"      && <AiPanel isMobile />}
        </div>

        {/* Mobile tab bar */}
        <div className="shrink-0 flex border-t border-rule bg-paper">
          {(["body", "outline", "ai"] as MobileTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-3 text-xs font-sans font-medium transition-colors ${
                mobileTab === tab
                  ? "text-accent border-t-2 border-accent -mt-px"
                  : "text-mute hover:text-ink"
              }`}
            >
              {tab === "body" ? "本文" : tab === "outline" ? "OUTLINE" : "AI"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function extractHeadings(md: string): EditorHeading[] {
  return md
    .split("\n")
    .filter((l) => /^#{1,3}\s/.test(l))
    .map((l) => {
      const m = l.match(/^(#{1,3})\s+(.+)/);
      return m ? { level: m[1].length, text: m[2].trim() } : null;
    })
    .filter((h): h is EditorHeading => h !== null);
}
