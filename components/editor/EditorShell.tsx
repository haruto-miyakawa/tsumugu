"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Editor } from "@tiptap/react";
import { ArticleData } from "@/types/article";
import {
  EditorHeading, EditorUpdateData, SaveStatus,
  SelectionRange, NodeTypeInfo,
} from "@/types/editor";
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
const LG_BREAKPOINT  = "(min-width: 1024px)";

export function EditorShell({ article }: Props) {
  const [mobileTab, setMobileTab] = useState<MobileTab>("body");
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(LG_BREAKPOINT);
    setIsDesktop(mq.matches);
    const fn = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  // ── Editor state ──────────────────────────────────────────────────────────
  const [charCount, setCharCount]   = useState(article.output.markdown.length);
  const [headings, setHeadings]     = useState<EditorHeading[]>(() => extractHeadings(article.output.markdown));
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  // Selection state — replaceRange is the EXPANDED block range, not the raw text selection
  const [selectedText, setSelectedText]   = useState<string>("");
  const [replaceRange, setReplaceRange]   = useState<SelectionRange | null>(null);
  const [replaceNodeType, setReplaceNodeType] = useState<NodeTypeInfo | null>(null);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const latestHtmlRef = useRef<string>("");
  const saveTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef  = useRef(true);
  const editorRef     = useRef<Editor | null>(null);
  const aiInputRef    = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // ── Auto-save ─────────────────────────────────────────────────────────────
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

  // ── Editor ready ──────────────────────────────────────────────────────────
  const handleEditorReady = useCallback((editor: Editor) => {
    editorRef.current = editor;

    editor.on("selectionUpdate", ({ editor: ed }) => {
      const { from, to } = ed.state.selection;
      if (from === to) {
        setSelectedText("");
        setReplaceRange(null);
        setReplaceNodeType(null);
        return;
      }

      // Text shown in context strip and sent to API
      const text = ed.state.doc.textBetween(from, to, "\n");
      setSelectedText(text);

      // Compute the EFFECTIVE block range & node type for replacement
      const { replaceRange: rr, nodeType } = getEffectiveReplacement(ed, from);
      setReplaceRange(rr);
      setReplaceNodeType(nodeType);
    });
  }, []);

  // ── Replace ───────────────────────────────────────────────────────────────
  const handleReplace = useCallback(
    (text: string, range: SelectionRange, nodeType: NodeTypeInfo | null) => {
      const ed = editorRef.current;
      if (!ed) return;
      const html = buildReplacementHtml(text.trim(), nodeType);
      ed.chain()
        .focus()
        .insertContentAt({ from: range.from, to: range.to }, html)
        .run();
    },
    []
  );

  const onAiFocus = useCallback(() => {
    aiInputRef.current?.focus();
  }, []);

  // ── Shared props ──────────────────────────────────────────────────────────
  const editorBodyProps = {
    article,
    onUpdate: handleEditorUpdate,
    onEditorReady: handleEditorReady,
    onAiFocus,
  };

  const aiPanelProps = {
    article,
    selectedText,
    replaceRange,
    replaceNodeType,
    onReplace: handleReplace,
    inputRef: aiInputRef,
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-68px)]">
      <EditorNavbar
        title={article.output.selectedTitle}
        charCount={charCount}
        articleId={article.id}
        status={article.status}
        saveStatus={saveStatus}
      />

      {isDesktop === null && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-rule border-t-accent animate-spin" />
        </div>
      )}

      {isDesktop === true && (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <OutlinePanel headings={headings} />
          <EditorBody {...editorBodyProps} />
          <AiPanel {...aiPanelProps} />
        </div>
      )}

      {isDesktop === false && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className={`h-full flex flex-col ${mobileTab === "body" ? "" : "hidden"}`}>
              <EditorBody {...editorBodyProps} isMobile />
            </div>
            {mobileTab === "outline" && <OutlinePanel headings={headings} isMobile />}
            {mobileTab === "ai"      && <AiPanel {...aiPanelProps} isMobile />}
          </div>

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
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Given a cursor position inside the editor, return the EFFECTIVE replacement
 * range and node type.
 *
 * The key insight:
 * - For headings: replace the whole heading node (depth 1).
 * - For blockquote > paragraph: replace only the inner paragraph (depth 2),
 *   keeping the blockquote wrapper intact.
 * - For list > listItem > paragraph: replace only the inner paragraph (depth 3).
 * - For regular paragraphs: replace the whole paragraph node (depth 1).
 *
 * pos.before(n) / pos.after(n) give the positions just outside the node at
 * depth n, suitable for insertContentAt to replace the entire node.
 */
function getEffectiveReplacement(
  ed: Editor,
  from: number
): { replaceRange: SelectionRange; nodeType: NodeTypeInfo | null } {
  try {
    const pos = ed.state.doc.resolve(from);
    if (pos.depth < 1) return { replaceRange: { from, to: from }, nodeType: null };

    const d1 = pos.node(1);

    // Heading — replace the entire heading node at depth 1
    if (d1.type.name === "heading") {
      return {
        replaceRange: { from: pos.before(1), to: pos.after(1) },
        nodeType: { type: "heading", attrs: d1.attrs },
      };
    }

    // Blockquote — replace only the inner paragraph (depth 2).
    // Do NOT wrap in <blockquote> again; the outer blockquote stays.
    if (d1.type.name === "blockquote" && pos.depth >= 2) {
      return {
        replaceRange: { from: pos.before(2), to: pos.after(2) },
        nodeType: { type: "paragraph", attrs: {} },
      };
    }

    // List — replace only the paragraph inside the listItem (depth 3).
    if (
      (d1.type.name === "bulletList" || d1.type.name === "orderedList") &&
      pos.depth >= 3
    ) {
      return {
        replaceRange: { from: pos.before(3), to: pos.after(3) },
        nodeType: { type: "paragraph", attrs: {} },
      };
    }

    // Default (paragraph, etc.) — replace the entire depth-1 block
    return {
      replaceRange: { from: pos.before(1), to: pos.after(1) },
      nodeType: { type: d1.type.name, attrs: d1.attrs },
    };
  } catch {
    // If position resolution fails, fall back to a safe no-op range
    return { replaceRange: { from, to: from }, nodeType: null };
  }
}

/**
 * Build the replacement HTML from suggestion text and the detected node type.
 * For blockquote and list cases the nodeType is already "paragraph" (the inner node),
 * so only headings need special wrapping.
 */
function buildReplacementHtml(text: string, nodeType: NodeTypeInfo | null): string {
  if (nodeType?.type === "heading") {
    const level = (nodeType.attrs.level as number) || 2;
    // Headings are single-line; collapse any newlines AI may have returned
    return `<h${level}>${text.replace(/\n+/g, " ").trim()}</h${level}>`;
  }
  // Paragraph (including inside blockquote/list) — just wrap in <p>
  return wrapParagraphs(text);
}

function wrapParagraphs(text: string): string {
  return text
    .trim()
    .split(/\n\n+/)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
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
