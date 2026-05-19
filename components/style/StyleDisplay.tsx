"use client";
import { StyleConfig } from "@/types/style";

const LABEL_MAP = {
  formality: { casual: "カジュアル", neutral: "ニュートラル", formal: "フォーマル" },
  humor: { none: "なし", light: "少し", frequent: "多め" },
  perspective: { first_person: "一人称", third_person: "三人称", mixed: "混在" },
  enthusiasm: { restrained: "控えめ", moderate: "普通", high: "高め" },
  opening: { hook: "フック", question: "問いかけ", anecdote: "エピソード", direct: "直接" },
  closing: { summary: "まとめ", cta: "CTA", question: "問いかけ", reflection: "振り返り" },
  headingFrequency: { few: "少ない", moderate: "普通", many: "多い" },
  paragraphLength: { short: "短め", medium: "普通", long: "長め" },
  jargonLevel: { none: "なし", some: "少し", heavy: "多め" },
  emojiUsage: { none: "使わない", minimal: "最小限", frequent: "よく使う" },
};

function Badge({ value }: { value: string }) {
  return (
    <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{value}</span>
  );
}

export function StyleDisplay({ style }: { style: StyleConfig }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">トーン</h3>
        <div className="flex flex-wrap gap-2">
          <Badge value={`文体: ${LABEL_MAP.formality[style.tone.formality]}`} />
          <Badge value={`ユーモア: ${LABEL_MAP.humor[style.tone.humor]}`} />
          <Badge value={`視点: ${LABEL_MAP.perspective[style.tone.perspective]}`} />
          <Badge value={`熱量: ${LABEL_MAP.enthusiasm[style.tone.enthusiasm]}`} />
        </div>
        {style.tone.description && (
          <p className="mt-2 text-sm text-gray-600 italic">"{style.tone.description}"</p>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">構成</h3>
        <div className="flex flex-wrap gap-2">
          <Badge value={`書き出し: ${LABEL_MAP.opening[style.structure.opening]}`} />
          <Badge value={`締め: ${LABEL_MAP.closing[style.structure.closing]}`} />
          <Badge value={`見出し: ${LABEL_MAP.headingFrequency[style.structure.headingFrequency]}`} />
          <Badge value={`段落: ${LABEL_MAP.paragraphLength[style.structure.paragraphLength]}`} />
        </div>
        {style.structure.typicalSections.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">セクション: {style.structure.typicalSections.join(" → ")}</p>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">語彙・表現</h3>
        <div className="flex flex-wrap gap-2">
          <Badge value={`専門用語: ${LABEL_MAP.jargonLevel[style.vocabulary.jargonLevel]}`} />
          <Badge value={`絵文字: ${LABEL_MAP.emojiUsage[style.vocabulary.emojiUsage]}`} />
        </div>
        {style.vocabulary.preferredExpressions.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">よく使う表現: {style.vocabulary.preferredExpressions.join(", ")}</p>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">note設定</h3>
        <div className="flex flex-wrap gap-2">
          <Badge value={`目標文字数: ${style.noteSpecific.targetLength}字`} />
          {style.noteSpecific.categoryHint && <Badge value={`カテゴリ: ${style.noteSpecific.categoryHint}`} />}
        </div>
        {style.noteSpecific.hashTags.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">{style.noteSpecific.hashTags.map(t => `#${t}`).join(" ")}</p>
        )}
      </div>
      <p className="text-xs text-gray-400">最終更新: {new Date(style.updatedAt).toLocaleString("ja-JP")}</p>
    </div>
  );
}
