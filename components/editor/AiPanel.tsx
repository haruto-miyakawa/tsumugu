"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Tsumugi } from "@/components/ui/Tsumugi";
import { ArticleData } from "@/types/article";
import type { SelectionRange, NodeTypeInfo } from "@/types/editor";

const SEPARATOR = "---SUGGESTION---";

interface AiMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  isStreaming?: boolean;
  error?: boolean;
  // Captured at send time so the button always replaces the correct block
  savedRange: SelectionRange | null;
  savedSelectedText: string;
  savedNodeType: NodeTypeInfo | null;
}

interface Props {
  article: ArticleData;
  selectedText: string;
  // Effective replacement range (expanded to full block boundaries in EditorShell)
  replaceRange: SelectionRange | null;
  // Node type info for that block (heading, paragraph, …)
  replaceNodeType: NodeTypeInfo | null;
  onReplace: (text: string, range: SelectionRange, nodeType: NodeTypeInfo | null) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isMobile?: boolean;
}

const QUICK_ACTIONS = [
  { label: "もっと柔らかく", prompt: "もっと柔らかい口調に書き直してください。" },
  { label: "具体例を追加",   prompt: "具体的なエピソードや例を加えて書き直してください。" },
  { label: "結びを書く",    prompt: "この段落の締めくくりになる一文を加えてください。" },
];

const GREETING: AiMessage = {
  id: "greeting",
  role: "assistant",
  text: "おかえりなさい。\n本文を選択してから話しかけてください。",
  savedRange: null,
  savedSelectedText: "",
  savedNodeType: null,
};

function parseSuggestion(text: string): { comment: string; suggestion: string | null } {
  const idx = text.indexOf(SEPARATOR);
  if (idx === -1) {
    // Suppress partial separator still streaming in
    const partial = text.match(/---S(?:UGGESTION?(?:---)?)?$/);
    return { comment: partial ? text.slice(0, partial.index).trimEnd() : text, suggestion: null };
  }
  return {
    comment:    text.slice(0, idx).trimEnd(),
    suggestion: text.slice(idx + SEPARATOR.length).trimStart(),
  };
}

export function AiPanel({
  article, selectedText, replaceRange, replaceNodeType,
  onReplace, inputRef, isMobile,
}: Props) {
  const [messages, setMessages]     = useState<AiMessage[]>([GREETING]);
  const [input, setInput]           = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef  = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stream = useCallback(
    async (
      prompt: string,
      range: SelectionRange | null,
      selText: string,
      nodeType: NodeTypeInfo | null,
    ) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const aiId = `ai-${Date.now()}`;
      setIsStreaming(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: "user",
          text: prompt,
          savedRange: range,
          savedSelectedText: selText,
          savedNodeType: nodeType,
        },
        {
          id: aiId,
          role: "assistant",
          text: "",
          isStreaming: true,
          savedRange: range,
          savedSelectedText: selText,
          savedNodeType: nodeType,
        },
      ]);

      try {
        const res = await fetch("/api/editor/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            instruction: prompt,
            selectedText: selText || undefined,
            fullContext: article.output.markdown,
          }),
        });

        if (!res.ok || !res.body) throw new Error("api_error");

        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => m.id === aiId ? { ...m, text: m.text + chunk } : m)
          );
        }
        setMessages((prev) =>
          prev.map((m) => m.id === aiId ? { ...m, isStreaming: false } : m)
        );
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiId
              ? { ...m, text: "うまく届かなかったようです。もう一度試してみてください。", isStreaming: false, error: true }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [article.output.markdown]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput("");
    stream(trimmed, replaceRange, selectedText, replaceNodeType);
  };

  const hasSelection = Boolean(selectedText);

  return (
    <div className={`bg-surface border-l border-rule flex flex-col overflow-hidden flex-shrink-0 ${isMobile ? "w-full" : "w-[280px]"}`}>

      {/* ── Header ── */}
      <div className="shrink-0 flex items-center gap-2.5 px-4 py-3 border-b border-rule">
        <Tsumugi size={28} mood={isStreaming ? "writing" : "thinking"} className="shrink-0" />
        <div className="min-w-0">
          <p className="text-[12px] font-sans font-medium text-ink leading-none">つむぎ</p>
          <p className="text-[10px] font-mono text-mute mt-0.5 truncate">聞き役 · 編集者モード</p>
        </div>
        <span className="ml-auto font-mono text-[9px] text-faint shrink-0">v2.4</span>
      </div>

      {/* ── Context strip ── */}
      <div className={`shrink-0 px-4 py-2.5 border-b border-rule transition-colors ${hasSelection ? "bg-marker/20" : "bg-surface"}`}>
        {hasSelection ? (
          <>
            <p className="font-mono text-[9px] text-faint uppercase tracking-widest mb-0.5">対象</p>
            <p className="text-[11px] font-sans text-ink-sub leading-snug">
              {selectedText.length > 30
                ? selectedText.slice(0, 30).replace(/\n/g, " ") + "…"
                : selectedText.replace(/\n/g, " ")}
            </p>
          </>
        ) : (
          <p className="text-[11px] font-sans text-faint italic">
            本文を選択してから話しかけてください
          </p>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-bg border border-rule rounded-sm px-3 py-2 max-w-[85%]">
                {msg.savedSelectedText && (
                  <p className="font-mono text-[9px] text-faint uppercase tracking-widest mb-1 truncate">
                    対象: {msg.savedSelectedText.slice(0, 20).replace(/\n/g, " ")}
                    {msg.savedSelectedText.length > 20 ? "…" : ""}
                  </p>
                )}
                <p className="text-[11px] font-sans text-ink-sub leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>
              </div>
            </div>
          ) : (
            <AssistantBubble key={msg.id} msg={msg} onReplace={onReplace} />
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick actions ── */}
      <div className="shrink-0 px-4 pb-3 border-t border-rule pt-3">
        <div className="flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                if (!isStreaming && hasSelection)
                  stream(action.prompt, replaceRange, selectedText, replaceNodeType);
              }}
              disabled={isStreaming || !hasSelection}
              title={!hasSelection ? "本文で範囲選択してから使えます" : action.label}
              className="text-[11px] font-sans text-ink-sub bg-paper border border-rule px-2.5 py-1 rounded-sm hover:bg-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 border-t border-rule p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hasSelection ? "つむぎに頼む…" : "まず本文を選択してください"}
            disabled={isStreaming || !hasSelection}
            className="flex-1 min-w-0 bg-surface border border-rule text-ink text-[12px] font-sans rounded-sm px-3 py-2 placeholder:text-faint focus:outline-none focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim() || !hasSelection}
            className="bg-accent text-paper text-[13px] font-sans font-medium px-3 py-2 rounded-sm disabled:opacity-40 shrink-0 hover:brightness-90 transition-all"
          >
            →
          </button>
        </form>
      </div>
    </div>
  );
}

// ── AI message card ───────────────────────────────────────────────────────────
function AssistantBubble({
  msg,
  onReplace,
}: {
  msg: AiMessage;
  onReplace: (text: string, range: SelectionRange, nodeType: NodeTypeInfo | null) => void;
}) {
  if (msg.id === "greeting") {
    return (
      <p className="text-[12px] font-serif text-ink-sub leading-relaxed whitespace-pre-wrap">
        {msg.text}
      </p>
    );
  }

  const { comment, suggestion } = parseSuggestion(msg.text);
  const hasSuggestion = suggestion !== null;
  const canReplace    = hasSuggestion && !msg.isStreaming && !msg.error && msg.savedRange !== null;

  return (
    <div className={`bg-paper border border-rule rounded-md p-3 space-y-2.5 ${msg.error ? "opacity-60" : ""}`}>

      {comment && (
        <p className="text-[12px] font-serif text-ink leading-relaxed whitespace-pre-wrap">
          {comment}
          {msg.isStreaming && !hasSuggestion && <StreamCursor />}
        </p>
      )}

      {hasSuggestion && (
        <div className="bg-surface border border-rule rounded-sm px-3 py-2.5">
          <p className="font-mono text-[9px] text-faint uppercase tracking-widest mb-1.5">
            提案テキスト
          </p>
          <p className="text-[12px] font-serif text-ink-sub leading-relaxed whitespace-pre-wrap">
            {suggestion}
            {msg.isStreaming && <StreamCursor />}
          </p>
        </div>
      )}

      {canReplace && (
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={() => onReplace(suggestion!, msg.savedRange!, msg.savedNodeType)}
            className="text-[11px] font-sans text-paper bg-accent px-3 py-1 rounded-sm hover:brightness-90 transition-colors"
          >
            選択範囲を置き換える
          </button>
          <span className="text-[10px] text-faint">
            「{msg.savedSelectedText.slice(0, 12).replace(/\n/g, " ")}
            {msg.savedSelectedText.length > 12 ? "…" : ""}」→ 提案
          </span>
        </div>
      )}

      {!msg.isStreaming && !hasSuggestion && !msg.error && msg.savedRange === null && (
        <p className="text-[10px] text-faint">
          段落を選択して話しかけると置き換えボタンが出ます
        </p>
      )}
    </div>
  );
}

function StreamCursor() {
  return <span className="inline-block w-0.5 h-3.5 bg-accent ml-0.5 align-middle animate-pulse" />;
}
