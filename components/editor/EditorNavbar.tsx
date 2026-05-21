import Link from "next/link";
import { ArticleStatus } from "@/types/article";
import { SaveStatus } from "@/types/editor";

interface Props {
  title: string;
  charCount: number;
  articleId: string;
  status: ArticleStatus;
  saveStatus: SaveStatus;
}

const STATUS_LABEL: Record<ArticleStatus, string> = {
  draft: "下書き",
  formatted: "整形済み",
  copied: "コピー済み",
};
const STATUS_CLASS: Record<ArticleStatus, string> = {
  draft:     "bg-surface text-mute",
  formatted: "bg-marker text-ink-sub",
  copied:    "bg-surface text-ink",
};

const CHAR_TARGET = 1800;

export function EditorNavbar({ title, charCount, articleId, status, saveStatus }: Props) {
  const over = charCount > CHAR_TARGET;

  const saveLabel =
    saveStatus === "saving"
      ? "· 保存中..."
      : saveStatus === "saved"
      ? "· 自動保存済み"
      : "";

  return (
    <div className="shrink-0 h-12 flex items-center gap-3 px-4 border-b border-rule bg-paper">
      {/* Title */}
      <p className="font-serif text-sm text-ink truncate flex-1 min-w-0">{title}</p>

      {/* Status badge */}
      <span className={`hidden md:inline text-[10px] font-mono px-1.5 py-0.5 rounded-sm shrink-0 ${STATUS_CLASS[status]}`}>
        {STATUS_LABEL[status]}
      </span>

      {/* Auto-save indicator */}
      <span className="hidden md:block text-[11px] font-mono text-faint shrink-0 min-w-[72px]">
        {saveLabel}
      </span>

      {/* Char count */}
      <span className="hidden md:block text-[11px] font-mono shrink-0">
        <span className={over ? "text-accent" : "text-ink"}>{charCount.toLocaleString()}</span>
        <span className="text-faint"> / {CHAR_TARGET.toLocaleString()}字</span>
      </span>

      {/* Mobile: compact count */}
      <span className="md:hidden text-[11px] font-mono text-mute shrink-0">
        {charCount.toLocaleString()}字
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/preview/${articleId}`}
          className="hidden md:flex items-center text-[13px] font-sans font-medium text-ink-sub border border-rule px-3 py-1.5 rounded-sm hover:text-ink hover:bg-surface transition-colors"
        >
          プレビュー
        </Link>
        <button
          disabled
          className="bg-accent text-paper text-[13px] font-sans font-medium px-3 py-1.5 rounded-sm opacity-40 cursor-not-allowed"
          title="Phase 3 で有効化"
        >
          <span className="hidden md:inline">noteに送る</span>
          <span className="md:hidden">送る</span>
        </button>
      </div>
    </div>
  );
}
