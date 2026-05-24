"use client";
import { useState } from "react";
import { StyleConfig } from "@/types/style";
import { ApiError } from "@/types/api";
import { TextArea } from "@/components/ui/TextArea";
import { Btn } from "@/components/ui/Btn";
import { Chip } from "@/components/ui/Chip";

interface StyleAnalyzerProps {
  onApply: (style: StyleConfig) => Promise<void>;
}

export function StyleAnalyzer({ onApply }: StyleAnalyzerProps) {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState<StyleConfig | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    setAnalyzed(null);
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/style/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json() as StyleConfig | ApiError;
      if (!res.ok) {
        setError((data as ApiError).error ?? "解析に失敗しました");
        return;
      }
      setAnalyzed(data as StyleConfig);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = async () => {
    if (!analyzed) return;
    setIsApplying(true);
    try {
      await onApply(analyzed);
      setAnalyzed(null);
      setText("");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-4">
      <TextArea
        label="note記事を貼り付け"
        hint="100文字以上の記事テキストを貼り付けてください"
        placeholder="ここに既存のnote記事を貼り付けてください..."
        className="h-40"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isAnalyzing}
      />

      <div className="flex items-center gap-3">
        <Btn
          kind="primary"
          icon="sparkle"
          onClick={handleAnalyze}
          disabled={text.trim().length < 100 || isAnalyzing}
        >
          {isAnalyzing ? "解析中…" : "AIで解析する"}
        </Btn>
        {text.trim().length > 0 && text.trim().length < 100 && (
          <span className="font-mono text-[11px] text-mute-soft">{text.trim().length}/100文字</span>
        )}
      </div>

      {error && (
        <p className="text-[13px] font-sans text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
          {error}
        </p>
      )}

      {analyzed && (
        <div className="bg-surface border border-rule rounded-sm p-4 space-y-3">
          <p className="font-display text-[10px] tracking-[0.2em] text-accent uppercase leading-none">
            ✦ 解析結果
          </p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <AnalyzeRow label="文体" value={FORMALITY_LABEL[analyzed.tone.formality]} />
            <AnalyzeRow label="ユーモア" value={HUMOR_LABEL[analyzed.tone.humor]} />
            <AnalyzeRow label="視点" value={PERSPECTIVE_LABEL[analyzed.tone.perspective]} />
            <AnalyzeRow label="熱量" value={ENTHUSIASM_LABEL[analyzed.tone.enthusiasm]} />
            <AnalyzeRow label="書き出し" value={OPENING_LABEL[analyzed.structure.opening]} />
            <AnalyzeRow label="締め" value={CLOSING_LABEL[analyzed.structure.closing]} />
            <AnalyzeRow label="見出し頻度" value={FREQUENCY_LABEL[analyzed.structure.headingFrequency]} />
            <AnalyzeRow label="段落長" value={LENGTH_LABEL[analyzed.structure.paragraphLength]} />
            <AnalyzeRow label="絵文字" value={EMOJI_LABEL[analyzed.vocabulary.emojiUsage]} />
            <AnalyzeRow label="目標文字数" value={`${analyzed.noteSpecific.targetLength}字`} />
          </dl>
          {analyzed.tone.description && (
            <p className="text-[13px] font-serif text-ink-soft italic leading-relaxed">
              「<span className="bg-highlight px-1">{analyzed.tone.description}</span>」
            </p>
          )}
          {analyzed.vocabulary.preferredExpressions.length > 0 && (
            <p className="text-[12px] font-sans text-ink-soft leading-relaxed">
              <span className="font-mono text-[10px] text-mute uppercase tracking-widest mr-1.5">よく使う表現</span>
              {analyzed.vocabulary.preferredExpressions.join("、")}
            </p>
          )}
          {analyzed.noteSpecific.hashTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analyzed.noteSpecific.hashTags.map((tag) => (
                <Chip key={tag}>#{tag}</Chip>
              ))}
            </div>
          )}
          <Btn
            kind="accent"
            icon="check"
            onClick={handleApply}
            disabled={isApplying}
          >
            {isApplying ? "適用中…" : "このスタイルを適用する"}
          </Btn>
        </div>
      )}
    </div>
  );
}

function AnalyzeRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="font-mono text-[11px] text-mute uppercase tracking-[0.08em]">{label}</dt>
      <dd className="font-sans text-[13px] text-ink">{value}</dd>
    </>
  );
}

const FORMALITY_LABEL = { casual: "カジュアル", neutral: "普通", formal: "フォーマル" } as const;
const HUMOR_LABEL = { none: "なし", light: "ほんのり", frequent: "多め" } as const;
const PERSPECTIVE_LABEL = { first_person: "一人称", third_person: "三人称", mixed: "混在" } as const;
const ENTHUSIASM_LABEL = { restrained: "落ち着き", moderate: "普通", high: "ハイテンション" } as const;
const OPENING_LABEL = { hook: "フック", question: "問いかけ", anecdote: "エピソード", direct: "直接" } as const;
const CLOSING_LABEL = { summary: "まとめ", cta: "CTA", question: "問いかけ", reflection: "振り返り" } as const;
const FREQUENCY_LABEL = { few: "少なめ", moderate: "普通", many: "多め" } as const;
const LENGTH_LABEL = { short: "短め", medium: "普通", long: "長め" } as const;
const EMOJI_LABEL = { none: "使わない", minimal: "少し", frequent: "よく使う" } as const;
