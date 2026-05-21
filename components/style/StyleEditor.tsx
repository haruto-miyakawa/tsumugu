"use client";

import { useState } from "react";
import { StyleConfig } from "@/types/style";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";

interface StyleEditorProps {
  style: StyleConfig;
  onSave: (style: StyleConfig) => Promise<void>;
  onCancel?: () => void;
}

// ── Option lists ────────────────────────────────────────────────────────────
const FORMALITY_OPTS = [
  { value: "casual",  label: "カジュアル — 話しかけるような文体" },
  { value: "neutral", label: "ニュートラル — 標準的な書き言葉" },
  { value: "formal",  label: "フォーマル — きちんとした文体" },
];
const HUMOR_OPTS = [
  { value: "none",     label: "ユーモアなし" },
  { value: "light",    label: "ほんのりユーモアあり" },
  { value: "frequent", label: "ユーモア多め" },
];
const PERSPECTIVE_OPTS = [
  { value: "first_person",  label: "一人称（私・僕）" },
  { value: "third_person",  label: "三人称" },
  { value: "mixed",         label: "一人称・三人称混在" },
];
const ENTHUSIASM_OPTS = [
  { value: "restrained", label: "落ち着いたトーン" },
  { value: "moderate",   label: "普通のテンション" },
  { value: "high",       label: "ハイテンション" },
];
const OPENING_OPTS = [
  { value: "hook",      label: "フック — 読者を引きつける書き出し" },
  { value: "question",  label: "問いかけ" },
  { value: "anecdote",  label: "エピソードから始める" },
  { value: "direct",    label: "直接的な結論から" },
];
const CLOSING_OPTS = [
  { value: "summary",    label: "まとめ" },
  { value: "cta",        label: "行動を促すCTA" },
  { value: "question",   label: "問いかけで締める" },
  { value: "reflection", label: "振り返り・余韻" },
];
const HEADING_FREQ_OPTS = [
  { value: "few",      label: "少なめ" },
  { value: "moderate", label: "適度に" },
  { value: "many",     label: "多め" },
];
const PARA_LEN_OPTS = [
  { value: "short",  label: "短め（2〜3文）" },
  { value: "medium", label: "標準（3〜5文）" },
  { value: "long",   label: "長め（5文以上）" },
];
const JARGON_OPTS = [
  { value: "none",  label: "専門用語は使わない" },
  { value: "some",  label: "少し使う" },
  { value: "heavy", label: "多く使う" },
];
const EMOJI_OPTS = [
  { value: "none",     label: "絵文字を使わない" },
  { value: "minimal",  label: "控えめに" },
  { value: "frequent", label: "よく使う" },
];

// ── Helper components ────────────────────────────────────────────────────────
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest text-mute uppercase mb-4">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 md:items-start">
      <div className="pt-0.5">
        <p className="text-[13px] font-sans text-ink">{label}</p>
        {hint && <p className="text-[11px] text-mute mt-0.5">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function TagsInput({
  value, onChange, placeholder,
}: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const raw = value.join(", ");
  return (
    <input
      type="text"
      defaultValue={raw}
      onBlur={(e) => {
        const items = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
        onChange(items);
      }}
      placeholder={placeholder}
      className="w-full bg-surface border border-rule text-ink text-[13px] font-sans rounded-sm px-3 py-2 focus:outline-none focus:border-accent transition-colors placeholder:text-faint"
    />
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function StyleEditor({ style, onSave, onCancel }: StyleEditorProps) {
  // Deep-copy to avoid mutating prop
  const [form, setForm] = useState<StyleConfig>(() => ({
    ...style,
    tone:        { ...style.tone },
    structure:   { ...style.structure, typicalSections: [...style.structure.typicalSections] },
    vocabulary:  { ...style.vocabulary, preferredExpressions: [...style.vocabulary.preferredExpressions], avoidedExpressions: [...style.vocabulary.avoidedExpressions] },
    noteSpecific: { ...style.noteSpecific, hashTags: [...style.noteSpecific.hashTags] },
  }));

  const [isSaving, setIsSaving] = useState(false);

  // Typed updaters to avoid index-signature issues
  const tone      = <K extends keyof StyleConfig["tone"]>(k: K, v: StyleConfig["tone"][K]) =>
    setForm((f) => ({ ...f, tone: { ...f.tone, [k]: v } }));
  const structure = <K extends keyof StyleConfig["structure"]>(k: K, v: StyleConfig["structure"][K]) =>
    setForm((f) => ({ ...f, structure: { ...f.structure, [k]: v } }));
  const vocab     = <K extends keyof StyleConfig["vocabulary"]>(k: K, v: StyleConfig["vocabulary"][K]) =>
    setForm((f) => ({ ...f, vocabulary: { ...f.vocabulary, [k]: v } }));
  const note      = <K extends keyof StyleConfig["noteSpecific"]>(k: K, v: StyleConfig["noteSpecific"][K]) =>
    setForm((f) => ({ ...f, noteSpecific: { ...f.noteSpecific, [k]: v } }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ ...form, updatedAt: new Date().toISOString() });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* ── Group 1: トーン ── */}
      <Group title="トーン">
        <Field label="文体">
          <Select
            options={FORMALITY_OPTS}
            value={form.tone.formality}
            onChange={(e) => tone("formality", e.target.value as StyleConfig["tone"]["formality"])}
          />
        </Field>
        <Field label="ユーモア">
          <Select
            options={HUMOR_OPTS}
            value={form.tone.humor}
            onChange={(e) => tone("humor", e.target.value as StyleConfig["tone"]["humor"])}
          />
        </Field>
        <Field label="視点">
          <Select
            options={PERSPECTIVE_OPTS}
            value={form.tone.perspective}
            onChange={(e) => tone("perspective", e.target.value as StyleConfig["tone"]["perspective"])}
          />
        </Field>
        <Field label="熱量">
          <Select
            options={ENTHUSIASM_OPTS}
            value={form.tone.enthusiasm}
            onChange={(e) => tone("enthusiasm", e.target.value as StyleConfig["tone"]["enthusiasm"])}
          />
        </Field>
        <Field label="メモ" hint="文体の特徴など自由記述">
          <textarea
            value={form.tone.description}
            onChange={(e) => tone("description", e.target.value)}
            rows={2}
            placeholder="例: 読者を励ます口調、具体例を多用する"
            className="w-full bg-surface border border-rule text-ink text-[13px] font-sans rounded-sm px-3 py-2 focus:outline-none focus:border-accent transition-colors resize-y placeholder:text-faint"
          />
        </Field>
      </Group>

      <div className="border-t border-rule" />

      {/* ── Group 2: 構成 ── */}
      <Group title="構成">
        <Field label="書き出し">
          <Select
            options={OPENING_OPTS}
            value={form.structure.opening}
            onChange={(e) => structure("opening", e.target.value as StyleConfig["structure"]["opening"])}
          />
        </Field>
        <Field label="締め方">
          <Select
            options={CLOSING_OPTS}
            value={form.structure.closing}
            onChange={(e) => structure("closing", e.target.value as StyleConfig["structure"]["closing"])}
          />
        </Field>
        <Field label="見出し">
          <Select
            options={HEADING_FREQ_OPTS}
            value={form.structure.headingFrequency}
            onChange={(e) => structure("headingFrequency", e.target.value as StyleConfig["structure"]["headingFrequency"])}
          />
        </Field>
        <Field label="段落長さ">
          <Select
            options={PARA_LEN_OPTS}
            value={form.structure.paragraphLength}
            onChange={(e) => structure("paragraphLength", e.target.value as StyleConfig["structure"]["paragraphLength"])}
          />
        </Field>
        <div className="space-y-3 pt-1">
          <Toggle
            label="箇条書きを使う"
            checked={form.structure.usesBulletPoints}
            onChange={(v) => structure("usesBulletPoints", v)}
          />
          <Toggle
            label="番号付きリストを使う"
            checked={form.structure.usesNumberedLists}
            onChange={(v) => structure("usesNumberedLists", v)}
          />
        </div>
        <Field label="典型セクション" hint="カンマ区切り">
          <TagsInput
            value={form.structure.typicalSections}
            onChange={(v) => structure("typicalSections", v)}
            placeholder="例: 体験談, 気づき, まとめ"
          />
        </Field>
      </Group>

      <div className="border-t border-rule" />

      {/* ── Group 3: 語彙・表現 ── */}
      <Group title="語彙・表現">
        <Field label="専門用語">
          <Select
            options={JARGON_OPTS}
            value={form.vocabulary.jargonLevel}
            onChange={(e) => vocab("jargonLevel", e.target.value as StyleConfig["vocabulary"]["jargonLevel"])}
          />
        </Field>
        <Field label="絵文字">
          <Select
            options={EMOJI_OPTS}
            value={form.vocabulary.emojiUsage}
            onChange={(e) => vocab("emojiUsage", e.target.value as StyleConfig["vocabulary"]["emojiUsage"])}
          />
        </Field>
        <Field label="好む表現" hint="カンマ区切り">
          <TagsInput
            value={form.vocabulary.preferredExpressions}
            onChange={(v) => vocab("preferredExpressions", v)}
            placeholder="例: 〜かもしれない, そっと, ふと"
          />
        </Field>
        <Field label="避ける表現" hint="カンマ区切り">
          <TagsInput
            value={form.vocabulary.avoidedExpressions}
            onChange={(v) => vocab("avoidedExpressions", v)}
            placeholder="例: 〜べき, 絶対に"
          />
        </Field>
      </Group>

      <div className="border-t border-rule" />

      {/* ── Group 4: note設定 ── */}
      <Group title="note 設定">
        <Field label="目標文字数">
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={500}
              max={10000}
              step={100}
              value={form.noteSpecific.targetLength}
              onChange={(e) => note("targetLength", Number(e.target.value))}
              className="w-28 bg-surface border border-rule text-ink text-[13px] font-sans rounded-sm px-3 py-2 focus:outline-none focus:border-accent transition-colors"
            />
            <span className="text-[12px] text-mute font-mono">字</span>
          </div>
        </Field>
        <Field label="カテゴリ">
          <input
            type="text"
            value={form.noteSpecific.categoryHint}
            onChange={(e) => note("categoryHint", e.target.value)}
            placeholder="例: エッセイ, テック, ライフスタイル"
            className="w-full bg-surface border border-rule text-ink text-[13px] font-sans rounded-sm px-3 py-2 focus:outline-none focus:border-accent transition-colors placeholder:text-faint"
          />
        </Field>
        <Field label="ハッシュタグ" hint="カンマ区切り">
          <TagsInput
            value={form.noteSpecific.hashTags}
            onChange={(v) => note("hashTags", v)}
            placeholder="例: #エッセイ, #日常, #コーヒー"
          />
        </Field>
      </Group>

      {/* ── Actions ── */}
      <div className="flex gap-2 pt-2">
        <Button onClick={handleSave} isLoading={isSaving}>保存</Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
            キャンセル
          </Button>
        )}
      </div>
    </div>
  );
}
