// No 'use client' — dynamically imported from EditorBody which is 'use client'
import { useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import type { EditorHeading, EditorUpdateData } from "@/types/editor";

interface Props {
  initialHtml: string;
  isMobile?: boolean;
  kicker?: string;
  date?: string;
  tags?: string[];
  onUpdate: (data: EditorUpdateData) => void;
  // Exposes the Editor instance to EditorShell so it can track selection & replace text
  onEditorReady?: (editor: Editor) => void;
  // Focuses the AiPanel input without blurring the editor (called from bubble menu)
  onAiFocus?: () => void;
}

export function RichEditor({
  initialHtml, isMobile, kicker, date, tags,
  onUpdate, onEditorReady, onAiFocus,
}: Props) {
  const onUpdateRef    = useRef(onUpdate);
  const onReadyRef     = useRef(onEditorReady);
  const onAiFocusRef   = useRef(onAiFocus);

  useEffect(() => { onUpdateRef.current  = onUpdate;       }, [onUpdate]);
  useEffect(() => { onReadyRef.current   = onEditorReady;  }, [onEditorReady]);
  useEffect(() => { onAiFocusRef.current = onAiFocus;      }, [onAiFocus]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      CharacterCount,
      Image.configure({ inline: false }),
      Placeholder.configure({
        showOnlyCurrent: true,
        placeholder: ({ node }) =>
          node.type.name === "heading" ? "見出しを入力..." : "本文を入力...",
      }),
    ],
    content: initialHtml,
    editorProps: { attributes: { class: "outline-none" } },
    onCreate({ editor }) {
      // Expose the full editor instance to EditorShell
      onReadyRef.current?.(editor);
    },
    onUpdate({ editor }) {
      const headings: EditorHeading[] = [];
      editor.state.doc.descendants((node) => {
        if (node.type.name === "heading") {
          headings.push({ level: node.attrs.level as number, text: node.textContent });
        }
      });
      onUpdateRef.current({
        html: editor.getHTML(),
        charCount: editor.storage.characterCount.characters() as number,
        headings,
      });
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-rule border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* ── Bubble menu: appears on text selection ── */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ state }) => !state.selection.empty}
        options={{ placement: "top", offset: 8 }}
        className="flex items-center gap-0.5 bg-paper border border-rule rounded-md shadow-float p-1 z-50"
      >
        <ToolbarBtn title="太字 (Ctrl+B)" isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}>B</ToolbarBtn>
        <ToolbarBtn title="斜体 (Ctrl+I)" isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}>I</ToolbarBtn>
        <ToolbarBtn title="マーカー" isActive={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}>◉</ToolbarBtn>

        <div className="w-px h-4 bg-rule mx-0.5 shrink-0" />

        {([2, 3] as const).map((level) => (
          <ToolbarBtn key={level} title={`見出し${level}`}
            isActive={editor.isActive("heading", { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}>
            H{level}
          </ToolbarBtn>
        ))}

        <div className="w-px h-4 bg-rule mx-0.5 shrink-0" />

        {/* AI button — onMouseDown + e.preventDefault() keeps editor focused & selection alive */}
        <button
          type="button"
          title="AIに相談（選択を維持したまま右パネルを開く）"
          onMouseDown={(e) => {
            e.preventDefault(); // prevent editor blur → selection preserved
            onAiFocusRef.current?.();
          }}
          className="w-7 h-7 flex items-center justify-center text-[11px] font-sans font-semibold rounded-sm transition-colors select-none text-accent hover:bg-marker cursor-pointer"
        >
          AI
        </button>
      </BubbleMenu>

      {/* ── Fixed top toolbar (desktop only) ── */}
      {!isMobile && (
        <div className="shrink-0 flex items-center gap-0.5 px-6 py-2 border-b border-rule bg-paper">
          {([1, 2, 3] as const).map((level) => (
            <ToolbarBtn key={level} title={`見出し${level}`}
              isActive={editor.isActive("heading", { level })}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}>
              H{level}
            </ToolbarBtn>
          ))}
          <div className="w-px h-4 bg-rule mx-1 shrink-0" />
          <ToolbarBtn title="太字 (Ctrl+B)" isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}>B</ToolbarBtn>
          <ToolbarBtn title="斜体 (Ctrl+I)" isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}>I</ToolbarBtn>
          <ToolbarBtn title="マーカー" isActive={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}>◉</ToolbarBtn>
          <div className="w-px h-4 bg-rule mx-1 shrink-0" />
          <ToolbarBtn title="箇条書き" isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}>•</ToolbarBtn>
          <ToolbarBtn title="番号付きリスト" isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolbarBtn>
          <ToolbarBtn title="引用" isActive={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</ToolbarBtn>
          <ToolbarBtn title="区切り線"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</ToolbarBtn>
          <div className="w-px h-4 bg-rule mx-1 shrink-0" />
          <ToolbarBtn title="画像（Phase 3 で有効化）" disabled>⬡</ToolbarBtn>
        </div>
      )}

      {/* ── Scrollable article content ── */}
      <div className="flex-1 overflow-y-auto">
        <article className={`mx-auto py-10 ${isMobile ? "px-5 max-w-full" : "px-10 max-w-[640px]"}`}>
          {kicker && (
            <p className="font-mono text-[10px] tracking-widest text-mute uppercase mb-5">{kicker}</p>
          )}
          {date && (
            <p className="text-[11px] font-sans text-faint mb-8">{date}</p>
          )}
          <EditorContent editor={editor} />
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-rule">
              {tags.map((tag) => (
                <span key={tag} className="text-[11px] font-mono text-mute bg-surface border border-rule px-2 py-0.5 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

function ToolbarBtn({
  children, title, isActive = false, disabled = false, onClick,
}: {
  children?: React.ReactNode;
  title: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={[
        "w-7 h-7 flex items-center justify-center text-[11px] font-mono rounded-sm transition-colors select-none",
        disabled
          ? "text-faint cursor-not-allowed"
          : isActive
          ? "bg-marker text-ink"
          : "text-mute hover:text-ink hover:bg-surface cursor-pointer",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
