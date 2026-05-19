"use client";
import { useState } from "react";
import { GenerateRequest } from "@/types/api";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";

interface GenerateFormProps {
  onSubmit: (req: GenerateRequest) => Promise<void>;
  isLoading: boolean;
  defaultTheme?: string;
}

const GENRES = ["エッセイ", "ハウツー", "体験記", "レビュー", "コラム"];
const TONES = ["です・ます", "カジュアル", "詩的"];
const STRUCTURES = ["起承転結", "結論先出し", "散文"];
const LENGTHS = [
  { value: "short", label: "短め", sub: "〜1,000字" },
  { value: "medium", label: "普通", sub: "〜2,000字" },
  { value: "long", label: "長め", sub: "〜3,500字" },
];

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-full border transition-all ${
        active
          ? "bg-ink text-paper border-ink"
          : "bg-surface border-rule text-mute hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

export function GenerateForm({ onSubmit, isLoading, defaultTheme = "" }: GenerateFormProps) {
  const [theme, setTheme] = useState(defaultTheme);
  const [episode, setEpisode] = useState("");
  const [targetReader, setTargetReader] = useState("");
  const [lengthPreference, setLengthPreference] = useState<"short" | "medium" | "long">("medium");
  const [genre, setGenre] = useState("");
  const [tone, setTone] = useState("");
  const [structure, setStructure] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const toggle = (current: string, value: string, set: (v: string) => void) => {
    set(current === value ? "" : value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ theme, episode, targetReader: targetReader || undefined, lengthPreference, genre: genre || undefined, tone: tone || undefined, structure: structure || undefined, additionalNotes: additionalNotes || undefined });
  };

  const isValid = theme.trim().length > 0 && episode.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Theme */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono tracking-widest text-mute uppercase">テーマ *</label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="例：副業を始めた理由"
          disabled={isLoading}
          required
          className="w-full border border-rule bg-paper text-ink text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-ink transition-colors"
          style={{ borderRadius: "4px" }}
        />
      </div>

      {/* Episode */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono tracking-widest text-mute uppercase">エピソード・ネタ *</label>
        <TextArea
          value={episode}
          onChange={(e) => setEpisode(e.target.value)}
          placeholder="書きたいエピソードや伝えたいことを自由に。箇条書きでもOKです。"
          className="h-28 rounded-sm border-rule bg-paper text-ink focus:border-ink"
          disabled={isLoading}
          required
        />
      </div>

      {/* Genre chips */}
      <div className="space-y-2">
        <p className="text-xs font-mono tracking-widest text-mute uppercase">ジャンル</p>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => <Chip key={g} label={g} active={genre === g} onClick={() => toggle(genre, g, setGenre)} />)}
        </div>
      </div>

      {/* Tone chips */}
      <div className="space-y-2">
        <p className="text-xs font-mono tracking-widest text-mute uppercase">口調</p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => <Chip key={t} label={t} active={tone === t} onClick={() => toggle(tone, t, setTone)} />)}
        </div>
      </div>

      {/* Structure chips */}
      <div className="space-y-2">
        <p className="text-xs font-mono tracking-widest text-mute uppercase">構成</p>
        <div className="flex flex-wrap gap-2">
          {STRUCTURES.map((s) => <Chip key={s} label={s} active={structure === s} onClick={() => toggle(structure, s, setStructure)} />)}
        </div>
      </div>

      {/* Length */}
      <div className="space-y-2">
        <p className="text-xs font-mono tracking-widest text-mute uppercase">長さ</p>
        <div className="grid grid-cols-3 gap-2">
          {LENGTHS.map(({ value, label, sub }) => (
            <button
              key={value}
              type="button"
              onClick={() => setLengthPreference(value as "short" | "medium" | "long")}
              className={`py-2.5 text-center border rounded-sm transition-all ${
                lengthPreference === value
                  ? "bg-ink text-paper border-ink"
                  : "bg-surface border-rule text-mute hover:border-ink hover:text-ink"
              }`}
              style={{ borderRadius: "4px" }}
            >
              <div className="text-sm font-medium">{label}</div>
              <div className="text-[10px] opacity-70">{sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reader + Notes row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono tracking-widest text-mute uppercase">ターゲット読者</label>
          <input
            type="text"
            value={targetReader}
            onChange={(e) => setTargetReader(e.target.value)}
            placeholder="例：副業に興味がある会社員"
            disabled={isLoading}
            className="w-full border border-rule bg-paper text-ink text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-ink transition-colors"
            style={{ borderRadius: "4px" }}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono tracking-widest text-mute uppercase">追加メモ</label>
          <input
            type="text"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="強調したい点など"
            disabled={isLoading}
            className="w-full border border-rule bg-paper text-ink text-sm px-4 py-2.5 rounded-sm focus:outline-none focus:border-ink transition-colors"
            style={{ borderRadius: "4px" }}
          />
        </div>
      </div>

      <Button type="submit" disabled={!isValid || isLoading} isLoading={isLoading} className="w-full md:w-auto">
        記事を生成する
      </Button>
    </form>
  );
}
