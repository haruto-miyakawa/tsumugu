"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PLATFORMS,
  type Platform,
  type FromReadmeRequest,
  type FromReadmeResponse,
} from "@/types/from-readme";
import { PLATFORM_CONFIGS } from "@/lib/platforms";
import { Tsumugi } from "@/components/mascot/Tsumugi";
import { Btn } from "@/components/ui/Btn";
import { Icon } from "@/components/ui/Icon";

interface FromReadmeModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (response: FromReadmeResponse) => void;
}

type WarningLevel = "none" | "light" | "medium" | "strong" | "blocked";

const README_MAX_CHARS = 100_000;

// TODO(v3.x): 文字数ベースではなく @anthropic-ai/tokenizer によるトークンベースに置き換える
function getWarningLevel(length: number): WarningLevel {
  if (length === 0) return "blocked";
  if (length > README_MAX_CHARS) return "blocked";
  if (length < 5000) return "none";
  if (length < 10000) return "light";
  if (length < 15000) return "medium";
  return "strong";
}

const WARNING_MESSAGES: Record<Exclude<WarningLevel, "none" | "blocked">, {
  title: string;
  body: string;
  showMascot: boolean;
}> = {
  light: {
    title: "長めのREADMEです",
    body: "解析に少し時間がかかります（〜10秒）。",
    showMascot: false,
  },
  medium: {
    title: "READMEがかなり長いです",
    body: "コストが増えます（参考：通常の約2倍）。要点だけ抜粋して投げると精度も上がります。",
    showMascot: false,
  },
  strong: {
    title: "READMEが非常に長いです",
    body: "コストが増え、要約品質も落ちる可能性があります。可能であれば要点を抜粋することを推奨します。",
    showMascot: true,
  },
};

export function FromReadmeModal({ open, onClose, onApply }: FromReadmeModalProps) {
  const [platform, setPlatform] = useState<Platform>("note");
  const [readmeText, setReadmeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pendingWarning, setPendingWarning] = useState<WarningLevel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 閉じる時の transient state リセット（effect ではなくユーザーアクション側で行う）
  const handleClose = useCallback(() => {
    setPendingWarning(null);
    setError(null);
    setDropError(null);
    setIsDragging(false);
    abortRef.current?.abort();
    onClose();
  }, [onClose]);

  // ─── body scroll lock + ESC ───────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isAnalyzing) {
        if (pendingWarning) setPendingWarning(null);
        else handleClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, isAnalyzing, pendingWarning, handleClose]);

  // ─── 解析 API 呼び出し ────────────────────────────────────────────────────
  const callApi = useCallback(async () => {
    setError(null);
    setPendingWarning(null);
    setIsAnalyzing(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const req: FromReadmeRequest = {
        source: { type: "text", readmeText },
        platform,
      };
      const res = await fetch("/api/generate/from-readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(req),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "解析に失敗しました");
        return;
      }
      // 親に渡す
      onApply(data as FromReadmeResponse);
      // フィールドをクリアしてから閉じる
      setReadmeText("");
      handleClose();
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError("通信エラーが発生しました");
    } finally {
      setIsAnalyzing(false);
    }
  }, [readmeText, platform, onApply, handleClose]);

  // ─── 「解析する」クリックハンドラ ─────────────────────────────────────────
  const handleAnalyze = () => {
    const level = getWarningLevel(readmeText.length);
    if (level === "blocked") return;
    if (level === "none") {
      callApi();
    } else {
      setPendingWarning(level);
    }
  };

  // ─── ドラッグ&ドロップ ───────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDropError(null);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const isMdOrTxt =
      file.name.endsWith(".md") ||
      file.name.endsWith(".txt") ||
      file.type === "text/markdown" ||
      file.type === "text/plain";
    if (!isMdOrTxt) {
      setDropError(".md か .txt を投入してください");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setReadmeText(text);
    };
    reader.onerror = () => setDropError("ファイルの読み込みに失敗しました");
    reader.readAsText(file);
  };

  const charCount = readmeText.length;
  const warningLevel = getWarningLevel(charCount);
  const isBlocked = warningLevel === "blocked";
  const blockedReason =
    charCount === 0
      ? null
      : charCount > README_MAX_CHARS
      ? `READMEが長すぎます（${README_MAX_CHARS.toLocaleString()}字まで）`
      : null;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/50"
      onClick={() => {
        if (!isAnalyzing) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="from-readme-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto bg-paper border border-rule rounded-sm shadow-pop"
      >
        {/* ─── ヘッダー ─── */}
        <div className="flex items-start justify-between gap-3 px-5 md:px-6 pt-5 pb-3 border-b border-rule">
          <div>
            <p className="font-display text-[11px] tracking-[0.22em] text-mute uppercase leading-none mb-1.5">
              FROM README
            </p>
            <h2
              id="from-readme-title"
              className="font-serif font-medium text-[20px] leading-[1.3] text-ink tracking-[0.01em]"
            >
              READMEから自動入力
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isAnalyzing}
            aria-label="閉じる"
            className="text-mute hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-1"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* ─── 本体 ─── */}
        <div className="px-5 md:px-6 py-5 space-y-5">
          {/* プラットフォーム選択 */}
          <fieldset className="space-y-2.5" disabled={isAnalyzing}>
            <legend className="font-display text-[10px] tracking-[0.22em] text-mute uppercase leading-none mb-2">
              プラットフォーム
            </legend>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const active = platform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1 px-3 py-[6px] rounded-full font-sans font-medium text-[12px] tracking-[0.02em] leading-none border transition-colors disabled:opacity-50 ${
                      active
                        ? "bg-accent text-paper border-accent"
                        : "bg-surface text-ink-soft border-rule hover:bg-paper hover:text-ink"
                    }`}
                  >
                    {PLATFORM_CONFIGS[p].label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* README 入力欄 */}
          <div className="space-y-2">
            <label
              htmlFor="from-readme-textarea"
              className="block font-display text-[10px] tracking-[0.22em] text-mute uppercase leading-none"
            >
              README または任意の Markdown
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-sm border bg-surface transition-colors ${
                isDragging
                  ? "border-accent"
                  : "border-rule focus-within:border-accent"
              }`}
            >
              <textarea
                ref={textareaRef}
                id="from-readme-textarea"
                value={readmeText}
                onChange={(e) => setReadmeText(e.target.value)}
                disabled={isAnalyzing}
                rows={10}
                placeholder="ここに貼り付け、または .md / .txt ファイルをドラッグ"
                className="w-full bg-transparent text-ink text-[13px] font-mono leading-relaxed rounded-sm px-3 py-2.5 focus:outline-none resize-y min-h-[200px] max-h-[400px] placeholder:text-mute-soft disabled:opacity-60"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[11px] text-mute leading-none">
                {charCount.toLocaleString()} 字
                {warningLevel !== "none" && warningLevel !== "blocked" && (
                  <span className="ml-2 text-accent">{warningLevel === "light" ? "やや長め" : warningLevel === "medium" ? "長い" : "非常に長い"}</span>
                )}
              </p>
              {dropError && (
                <p className="font-sans text-[11px] text-accent leading-none">{dropError}</p>
              )}
            </div>
          </div>

          {/* ブロック理由（10万字超 or 0字） */}
          {blockedReason && (
            <p className="font-sans text-[12px] text-accent leading-snug">
              {blockedReason}
            </p>
          )}

          {/* API エラー */}
          {error && (
            <div className="bg-paper border border-accent rounded-sm px-3 py-2.5">
              <p className="font-sans text-[12px] text-accent leading-snug">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* ─── フッター ─── */}
        <div className="px-5 md:px-6 py-4 border-t border-rule bg-surface flex items-center justify-between gap-3">
          <p className="font-serif text-[12px] text-mute leading-snug">
            {isAnalyzing
              ? "つむぎが解析しています…"
              : "解析後、フォームに自動入力されます"}
          </p>
          <div className="flex items-center gap-3">
            {isAnalyzing && <Tsumugi size={32} mood="thinking" />}
            <Btn
              kind="primary"
              size="lg"
              icon="sparkle"
              iconRight="arrow-right"
              disabled={isBlocked || isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? "解析中…" : "解析する"}
            </Btn>
          </div>
        </div>

        {/* ─── 警告ダイアログ（重ね表示） ─── */}
        {pendingWarning && pendingWarning !== "none" && pendingWarning !== "blocked" && (
          <WarningOverlay
            level={pendingWarning}
            charCount={charCount}
            onConfirm={callApi}
            onCancel={() => setPendingWarning(null)}
          />
        )}
      </div>
    </div>
  );
}

// ─── 警告オーバーレイ ─────────────────────────────────────────────────────
function WarningOverlay({
  level,
  charCount,
  onConfirm,
  onCancel,
}: {
  level: "light" | "medium" | "strong";
  charCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const msg = WARNING_MESSAGES[level];
  return (
    <div
      className="absolute inset-0 bg-paper/85 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-[480px] bg-paper border border-ink rounded-sm shadow-hard p-5">
        <div className="flex items-start gap-3">
          {msg.showMascot && (
            <div className="shrink-0">
              <Tsumugi size={48} mood="thinking" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-display text-[10px] tracking-[0.2em] text-accent uppercase leading-none mb-1.5">
              ✦ 注意
            </p>
            <h3 className="font-serif font-medium text-[16px] leading-[1.4] text-ink">
              {msg.title}
            </h3>
            <p className="mt-2 font-serif text-[13px] text-ink-soft leading-relaxed">
              {msg.body}
              <span className="block mt-1 font-mono text-[11px] text-mute">
                現在の文字数: {charCount.toLocaleString()} 字
              </span>
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Btn kind="quiet" size="sm" onClick={onCancel}>
            キャンセル
          </Btn>
          <Btn kind="primary" size="sm" iconRight="arrow-right" onClick={onConfirm}>
            {level === "strong" ? "それでも続行" : "続行"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
