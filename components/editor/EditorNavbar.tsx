import Link from "next/link";
import { ArticleStatus } from "@/types/article";
import { SaveStatus } from "@/types/editor";
import { Btn } from "@/components/ui/Btn";
import { Icon } from "@/components/ui/Icon";

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

const CHAR_TARGET = 1800;

export function EditorNavbar({ title, charCount, articleId, status, saveStatus }: Props) {
  const over = charCount > CHAR_TARGET;

  const saveLabel =
    saveStatus === "saving"
      ? "保存中…"
      : saveStatus === "saved"
      ? "自動保存"
      : "未保存";

  return (
    <div className="shrink-0 h-12 flex items-center gap-3 px-4 md:px-5 border-b border-rule bg-paper">
      {/* Back / title */}
      <Link
        href="/library"
        aria-label="ライブラリへ戻る"
        className="text-mute hover:text-ink transition-colors shrink-0"
      >
        <Icon name="arrow-left" size={16} />
      </Link>
      <p className="font-sans text-[13px] font-medium text-ink truncate min-w-0">
        {title}
      </p>

      {/* Meta line — all mono, mute, dot-separated */}
      <div className="hidden md:flex items-center gap-2 shrink-0 font-mono text-[11px] text-mute leading-none">
        <span className="text-mute-soft">·</span>
        <span>{STATUS_LABEL[status]}</span>
        <span className="text-mute-soft">·</span>
        <span>{saveLabel}</span>
      </div>

      <div className="flex-1 min-w-0" />

      {/* Char count + divider */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-[11px] leading-none">
          <span className={over ? "text-accent" : "text-ink"}>{charCount.toLocaleString()}</span>
          <span className="text-mute-soft"> / {CHAR_TARGET.toLocaleString()}字</span>
        </span>
        <span className="hidden md:block w-px h-3.5 bg-rule" aria-hidden="true" />

        {/* Actions */}
        <Link href={`/preview/${articleId}`} className="hidden md:inline-block">
          <Btn kind="ghost" size="sm" icon="eye">プレビュー</Btn>
        </Link>
        <button
          type="button"
          disabled
          title="Phase 3 で有効化"
          className="inline-flex items-center justify-center gap-1.5 h-[30px] px-3 rounded-full text-[12px] font-sans font-medium tracking-[0.01em] border-[1.5px] bg-accent text-paper border-accent opacity-40 cursor-not-allowed"
        >
          <span className="hidden md:inline">noteに送る</span>
          <span className="md:hidden">送る</span>
          <Icon name="send" size={13} />
        </button>
      </div>
    </div>
  );
}
