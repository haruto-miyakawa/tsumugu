"use client";
import { useState } from "react";
import { StyleConfig } from "@/types/style";
import { ApiError } from "@/types/api";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";

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
        <Button
          onClick={handleAnalyze}
          isLoading={isAnalyzing}
          disabled={text.trim().length < 100}
        >
          AIで解析する
        </Button>
        {text.trim().length > 0 && text.trim().length < 100 && (
          <span className="text-xs text-gray-400">{text.trim().length}/100文字</span>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {analyzed && (
        <div className="border border-blue-200 rounded-xl bg-blue-50 p-4 space-y-3">
          <h3 className="font-semibold text-blue-900 text-sm">解析結果</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
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
            <p className="text-sm text-blue-800 italic">&ldquo;{analyzed.tone.description}&rdquo;</p>
          )}
          {analyzed.vocabulary.preferredExpressions.length > 0 && (
            <div className="text-sm">
              <span className="text-gray-600">よく使う表現: </span>
              <span className="text-gray-900">{analyzed.vocabulary.preferredExpressions.join("、")}</span>
            </div>
          )}
          {analyzed.noteSpecific.hashTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {analyzed.noteSpecific.hashTags.map((tag) => (
                <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <Button onClick={handleApply} isLoading={isApplying}>
            このスタイルを適用する
          </Button>
        </div>
      )}
    </div>
  );
}

function AnalyzeRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
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
