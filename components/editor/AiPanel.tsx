"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Tsumugi, type TsumugiMood } from "@/components/mascot/Tsumugi";
import { Btn } from "@/components/ui/Btn";
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
  const [justCompleted, setJustCompleted] = useState(false);
  const abortRef  = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => {
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
  }, []);

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
      setJustCompleted(false);
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

        // Light a "happy" mood briefly when generation completes
        setJustCompleted(true);
        if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
        completeTimerRef.current = setTimeout(() => setJustCompleted(false), 2500);
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

  // Mood logic — observed state only, no critique
  const mood: TsumugiMood = isStreaming
    ? "writing"
    : justCompleted
    ? "happy"
    : input.trim().length > 0
    ? "thinking"
    : "idle";

  return (
    <div className={`bg-surface border-l border-rule flex flex-col overflow-hidden flex-shrink-0 ${isMobile ? "w-full" : "w-[300px]"}`}>

      {/* ── Header — つむぎ avatar with live mood ── */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-rule bg-paper">
        <Tsumugi size={40} mood={mood} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[13px] font-medium text-ink leading-none">つむぎ</p>
          <p className="font-mono text-[10px] text-mute mt-1 truncate leading-none">
            {isStreaming ? "書き中…" : justCompleted ? "できました" : "聞き役 · 編集者モード"}
          </p>
        </div>
      </div>

      {/* ── Context strip — yellow marker on selection ── */}
      <div
        className={`shrink-0 px-4 py-2.5 border-b border-rule transition-colors ${
          hasSelection ? "bg-highlight" : "bg-surface"
        }`}
      >
        {hasSelection ? (
          <>
            <p className="font-display text-[10px] text-ink-soft tracking-[0.18em] uppercase mb-0.5 leading-none">
              対象
            </p>
            <p className="text-[12px] font-serif text-ink leading-snug">
              {selectedText.length > 36
                ? selectedText.slice(0, 36).replace(/\n/g, " ") + "…"
                : selectedText.replace(/\n/g, " ")}
            </p>
          </>
        ) : (
          <p className="text-[11px] font-sans text-mute italic leading-snug">
            本文を選択してから話しかけてください
          </p>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-ink text-paper rounded-sm px-3 py-2 max-w-[88%]">
                {msg.savedSelectedText && (
                  <p className="font-mono text-[9px] text-paper/70 uppercase tracking-widest mb-1 truncate">
                    対象: {msg.savedSelectedText.slice(0, 20).replace(/\n/g, " ")}
                    {msg.savedSelectedText.length > 20 ? "…" : ""}
                  </p>
                )}
                <p className="text-[12px] font-sans leading-relaxed whitespace-pre-wrap">
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

      {/* ── Quick actions — Chip-styled buttons ── */}
      <div className="shrink-0 px-4 pt-3 pb-2 border-t border-rule">
        <p className="font-display text-[9px] text-mute tracking-[0.18em] uppercase mb-2 leading-none">
          QUICK
        </p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                if (!isStreaming && hasSelection)
                  stream(action.prompt, replaceRange, selectedText, replaceNodeType);
              }}
              disabled={isStreaming || !hasSelection}
              title={!hasSelection ? "本文で範囲選択してから使えます" : action.label}
              className="inline-flex items-center gap-1 px-2.5 py-[5px] rounded-full font-sans font-medium text-[11px] tracking-[0.02em] leading-none border bg-paper text-ink-soft border-rule hover:bg-surface2 hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 border-t border-rule p-3 bg-paper">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-surface border border-rule rounded-full pl-3.5 pr-1.5 py-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hasSelection ? "つむぎに頼む…" : "まず本文を選択してください"}
            disabled={isStreaming || !hasSelection}
            className="flex-1 min-w-0 bg-transparent text-ink text-[12px] font-sans py-1 placeholder:text-mute-soft focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim() || !hasSelection}
            aria-label="送信"
            className="w-7 h-7 rounded-full bg-ink text-paper flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all shrink-0"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
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
      <p className="text-[12px] font-serif text-ink-soft leading-relaxed whitespace-pre-wrap">
        {msg.text}
      </p>
    );
  }

  const { comment, suggestion } = parseSuggestion(msg.text);
  const hasSuggestion = suggestion !== null;
  const canReplace    = hasSuggestion && !msg.isStreaming && !msg.error && msg.savedRange !== null;

  return (
    <div className={`bg-paper border border-rule rounded-sm p-3 space-y-2.5 ${msg.error ? "opacity-60" : ""}`}>

      {comment && (
        <p className="text-[12px] font-serif text-ink leading-[1.65] whitespace-pre-wrap">
          {comment}
          {msg.isStreaming && !hasSuggestion && <StreamCursor />}
        </p>
      )}

      {hasSuggestion && (
        <div className="bg-surface border border-rule rounded-sm px-3 py-2.5">
          <p className="font-display text-[10px] text-mute tracking-[0.18em] uppercase mb-1.5 leading-none">
            提案テキスト
          </p>
          <p className="text-[12px] font-serif leading-[1.7] whitespace-pre-wrap">
            <span className="bg-highlight text-ink box-decoration-clone px-[3px] py-[1px]">
              {suggestion}
              {msg.isStreaming && <StreamCursor />}
            </span>
          </p>
        </div>
      )}

      {canReplace && (
        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
          <Btn
            kind="accent"
            size="sm"
            iconRight="arrow-right"
            onClick={() => onReplace(suggestion!, msg.savedRange!, msg.savedNodeType)}
          >
            選択範囲を置き換える
          </Btn>
          <span className="font-mono text-[10px] text-mute-soft">
            「{msg.savedSelectedText.slice(0, 12).replace(/\n/g, " ")}
            {msg.savedSelectedText.length > 12 ? "…" : ""}」→ 提案
          </span>
        </div>
      )}

      {!msg.isStreaming && !hasSuggestion && !msg.error && msg.savedRange === null && (
        <p className="text-[10px] text-mute-soft">
          段落を選択して話しかけると置き換えボタンが出ます
        </p>
      )}
    </div>
  );
}

function StreamCursor() {
  return <span className="inline-block w-0.5 h-3.5 bg-ink ml-0.5 align-middle animate-pulse" />;
}
