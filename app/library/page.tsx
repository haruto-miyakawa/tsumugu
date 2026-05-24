import Link from "next/link";
import { readJson, listArticleFiles, getArticlePath } from "@/lib/file-storage";
import { ArticleData, ArticleSummary } from "@/types/article";
import { Tsumugi } from "@/components/mascot/Tsumugi";
import { TsumugiTiny } from "@/components/mascot/TsumugiTiny";
import { Btn } from "@/components/ui/Btn";
import { Chip } from "@/components/ui/Chip";
import { BigNum } from "@/components/ui/BigNum";
import { SectionHead } from "@/components/ui/SectionHead";
import { Icon } from "@/components/ui/Icon";

const STATUS_LABEL: Record<ArticleSummary["status"], string> = {
  draft: "下書き",
  formatted: "整形済み",
  copied: "コピー済み",
};

const LENGTH_TARGET: Record<string, number> = { short: 1000, medium: 2000, long: 3500 };

async function getAllArticles() {
  const files = await listArticleFiles();
  const list: (ArticleSummary & { progress: number; wordCount: number; updatedAt: string })[] = [];
  for (const f of files) {
    const a = await readJson<ArticleData>(getArticlePath(f.replace(".json", "")));
    if (!a) continue;
    const target = LENGTH_TARGET[a.input.lengthPreference ?? "medium"];
    list.push({
      id: a.id,
      title: a.output.selectedTitle,
      theme: a.input.theme,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      status: a.status,
      progress: Math.min(100, Math.round((a.output.markdown.length / target) * 100)),
      wordCount: a.output.markdown.length,
    });
  }
  list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return list;
}

export default async function LibraryPage() {
  const articles = await getAllArticles();

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-9 pb-28 md:pb-12">
      <SectionHead
        kicker="LIBRARY · 全ての記事"
        title={
          articles.length > 0
            ? `${articles.length}つの物語`
            : "まだ物語はありません"
        }
        right={
          articles.length > 0 ? (
            <div className="flex gap-1.5">
              <Chip active>すべて</Chip>
              <Chip>下書き</Chip>
              <Chip>整形済み</Chip>
            </div>
          ) : null
        }
      />

      {articles.length === 0 ? (
        <div className="bg-paper border border-rule rounded-sm py-16 px-6 flex flex-col items-center gap-4 text-center">
          <Tsumugi size={72} mood="idle" />
          <p className="font-serif text-sm text-mute leading-relaxed">
            まだ記事がありません。<br />
            最初の一行を、紡ぎはじめましょう。
          </p>
          <Link href="/generate">
            <Btn kind="primary" size="md" iconRight="arrow-right">記事を生成する</Btn>
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {articles.map((a, i) => (
            <li key={a.id}>
              <LibraryRow
                href={`/preview/${a.id}`}
                title={a.title}
                statusLabel={STATUS_LABEL[a.status]}
                statusKind={a.status}
                wordCount={a.wordCount}
                progress={a.progress}
                updatedAt={a.updatedAt}
                hot={i === 0}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

interface LibraryRowProps {
  href: string;
  title: string;
  statusLabel: string;
  statusKind: ArticleSummary["status"];
  wordCount: number;
  progress: number;
  updatedAt: string;
  hot?: boolean;
}
function LibraryRow({
  href,
  title,
  statusLabel,
  statusKind,
  wordCount,
  progress,
  updatedAt,
  hot,
}: LibraryRowProps) {
  return (
    <Link
      href={href}
      className="relative overflow-hidden bg-paper border border-rule rounded-sm flex items-center gap-4 md:gap-5 px-4 md:px-5 py-4 hover:bg-surface transition-colors group"
    >
      {hot && <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent" aria-hidden="true" />}
      <TsumugiTiny size={36} />
      <div className="flex-1 min-w-0">
        <h3 className="font-serif font-medium text-[15px] md:text-[16px] leading-[1.3] text-ink truncate group-hover:text-accent transition-colors">
          {title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center px-1.5 py-[3px] rounded-full font-mono text-[10px] tracking-[0.04em] leading-none border ${
              statusKind === "formatted"
                ? "bg-highlight text-ink-soft border-rule"
                : statusKind === "copied"
                ? "bg-ink text-paper border-ink"
                : "bg-surface text-mute border-rule"
            }`}
          >
            {statusLabel}
          </span>
          <span className="font-mono text-[11px] text-mute">{wordCount.toLocaleString()}字</span>
          <span className="text-mute-soft">·</span>
          <span className="font-mono text-[11px] text-mute-soft">
            {new Date(updatedAt).toLocaleDateString("ja-JP")}
          </span>
        </div>
      </div>
      <div className="hidden sm:flex flex-col gap-1 w-[120px] shrink-0">
        <div className="flex items-baseline gap-1.5">
          <BigNum size={20}>{progress}</BigNum>
          <span className="font-display text-[10px] tracking-[0.1em] text-mute leading-none">% DONE</span>
        </div>
        <div className="h-[3px] bg-surface2 rounded-full overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <Icon name="arrow-right" size={16} className="text-ink shrink-0" />
    </Link>
  );
}
