"use client";
import { useState } from "react";
import { GenerateRequest } from "@/types/api";
import { GENRES, TONES, STRUCTURES, type LengthPreference } from "@/types/from-readme";
import { TextArea } from "@/components/ui/TextArea";
import { Btn } from "@/components/ui/Btn";

interface GenerateFormProps {
  onSubmit: (req: GenerateRequest) => Promise<void>;
  isLoading: boolean;
  defaultTheme?: string;
}

const LENGTHS: ReadonlyArray<{ value: LengthPreference; label: string; sub: string }> = [
  { value: "short",  label: "短め", sub: "〜1,000字" },
  { value: "medium", label: "普通", sub: "〜2,000字" },
  { value: "long",   label: "長め", sub: "〜3,500字" },
];

/** Selectable pill chip used inside the generate form (different from display-only Chip). */
function PickChip({
  label,
  active,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 px-3 py-[6px] rounded-full font-sans font-medium text-[12px] tracking-[0.02em] leading-none border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        active
          ? "bg-ink text-paper border-ink"
          : "bg-surface text-ink-soft border-rule hover:bg-paper hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

const labelCls =
  "font-display text-[10px] tracking-[0.22em] text-mute uppercase leading-none";
const inputCls =
  "w-full bg-surface border border-rule text-ink text-[13px] font-sans rounded-sm px-3 py-2.5 focus:outline-none focus:border-accent transition-colors placeholder:text-mute-soft";

export function GenerateForm({ onSubmit, isLoading, defaultTheme = "" }: GenerateFormProps) {
  const [theme, setTheme] = useState(defaultTheme);
  const [episode, setEpisode] = useState("");
  const [targetReader, setTargetReader] = useState("");
  const [lengthPreference, setLengthPreference] = useState<LengthPreference>("medium");
  const [genre, setGenre] = useState("");
  const [tone, setTone] = useState("");
  const [structure, setStructure] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const toggle = (current: string, value: string, set: (v: string) => void) => {
    set(current === value ? "" : value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      theme,
      episode,
      targetReader: targetReader || undefined,
      lengthPreference,
      genre: genre || undefined,
      tone: tone || undefined,
      structure: structure || undefined,
      additionalNotes: additionalNotes || undefined,
    });
  };

  const isValid = theme.trim().length > 0 && episode.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Theme */}
      <div className="space-y-2">
        <label className={labelCls}>テーマ *</label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="例：副業を始めた理由"
          disabled={isLoading}
          required
          className={inputCls}
        />
      </div>

      {/* Episode */}
      <div className="space-y-2">
        <label className={labelCls}>エピソード・ネタ *</label>
        <TextArea
          value={episode}
          onChange={(e) => setEpisode(e.target.value)}
          placeholder="書きたいエピソードや伝えたいことを自由に。箇条書きでもOKです。"
          className="h-28 bg-surface border-rule text-ink rounded-sm focus:border-accent"
          disabled={isLoading}
          required
        />
      </div>

      <div className="border-t border-rule" />

      {/* Genre chips */}
      <div className="space-y-2.5">
        <p className={labelCls}>ジャンル</p>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <PickChip key={g} label={g} active={genre === g} disabled={isLoading} onClick={() => toggle(genre, g, setGenre)} />
          ))}
        </div>
      </div>

      {/* Tone chips */}
      <div className="space-y-2.5">
        <p className={labelCls}>口調</p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <PickChip key={t} label={t} active={tone === t} disabled={isLoading} onClick={() => toggle(tone, t, setTone)} />
          ))}
        </div>
      </div>

      {/* Structure chips */}
      <div className="space-y-2.5">
        <p className={labelCls}>構成</p>
        <div className="flex flex-wrap gap-2">
          {STRUCTURES.map((s) => (
            <PickChip key={s} label={s} active={structure === s} disabled={isLoading} onClick={() => toggle(structure, s, setStructure)} />
          ))}
        </div>
      </div>

      {/* Length cards */}
      <div className="space-y-2.5">
        <p className={labelCls}>長さ</p>
        <div className="grid grid-cols-3 gap-2.5">
          {LENGTHS.map(({ value, label, sub }) => {
            const active = lengthPreference === value;
            return (
              <button
                key={value}
                type="button"
                disabled={isLoading}
                onClick={() => setLengthPreference(value)}
                className={`relative py-3 px-2 text-center border rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  active
                    ? "bg-paper border-ink text-ink"
                    : "bg-surface border-rule text-mute hover:bg-paper hover:text-ink"
                }`}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-accent"
                  />
                )}
                <div className="font-serif text-[15px] font-medium leading-tight">{label}</div>
                <div className="font-mono text-[10px] text-mute mt-1 leading-none">{sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-rule" />

      {/* Reader + Notes row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelCls}>ターゲット読者</label>
          <input
            type="text"
            value={targetReader}
            onChange={(e) => setTargetReader(e.target.value)}
            placeholder="例：副業に興味がある会社員"
            disabled={isLoading}
            className={inputCls}
          />
        </div>
        <div className="space-y-2">
          <label className={labelCls}>追加メモ</label>
          <input
            type="text"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="強調したい点など"
            disabled={isLoading}
            className={inputCls}
          />
        </div>
      </div>

      <div className="pt-2 flex flex-col md:flex-row md:items-center gap-3">
        <Btn
          type="submit"
          kind="primary"
          size="lg"
          icon="sparkle"
          iconRight="arrow-right"
          disabled={!isValid || isLoading}
        >
          {isLoading ? "生成中…" : "記事を生成する"}
        </Btn>
        <p className="font-serif text-[12px] text-mute leading-snug">
          30秒〜1分かかります。<br className="md:hidden" />
          つむぎが構成案と本文を用意します。
        </p>
      </div>
    </form>
  );
}
