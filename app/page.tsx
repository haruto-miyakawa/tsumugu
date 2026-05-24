import Link from "next/link";
import { readJson, listArticleFiles, getArticlePath } from "@/lib/file-storage";
import { ArticleData } from "@/types/article";
import { Tsumugi } from "@/components/mascot/Tsumugi";
import { TsumugiTiny } from "@/components/mascot/TsumugiTiny";
import { Btn } from "@/components/ui/Btn";
import { Chip } from "@/components/ui/Chip";
import { BigNum } from "@/components/ui/BigNum";
import { SectionHead } from "@/components/ui/SectionHead";
import { Icon } from "@/components/ui/Icon";

const STATUS_LABEL: Record<string, string> = {
  draft: "下書き",
  formatted: "整形済み",
  copied: "コピー済み",
};
const LENGTH_TARGET: Record<string, number> = { short: 1000, medium: 2000, long: 3500 };

const SUGGESTIONS = [
  "朝のルーティンが変わった日のこと",
  "最近ハマっているものと、それが教えてくれたこと",
  "失敗したけど、振り返ると笑えること",
];

async function getData() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "GOOD MORNING" : hour < 17 ? "GOOD AFTERNOON" : "GOOD EVENING";

  const files = await listArticleFiles();
  const articles: ArticleData[] = [];
  for (const f of files) {
    const a = await readJson<ArticleData>(getArticlePath(f.replace(".json", "")));
    if (a) articles.push(a);
  }
  articles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const activityDates = new Set(articles.map((a) => new Date(a.updatedAt).toDateString()));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (activityDates.has(d.toDateString())) streak++;
    else if (i > 0) break;
  }

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekWords = articles
    .filter((a) => new Date(a.updatedAt).getTime() > weekAgo)
    .reduce((s, a) => s + a.output.markdown.length, 0);

  return {
    greeting,
    articles: articles.slice(0, 4),
    totalArticles: articles.length,
    streak,
    weekWords,
  };
}

function formatK(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n || 0);
}

export default async function DashboardPage() {
  const { greeting, articles, totalArticles, streak, weekWords } = await getData();

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-9 pb-28 md:pb-12">
      {/* ───── HERO ───── */}
      <section className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 mb-8 md:mb-10">
        <div className="flex items-start gap-5 flex-1 min-w-0">
          <div className="shrink-0 hidden sm:block">
            <Tsumugi size={108} mood="happy" />
          </div>
          <div className="sm:hidden shrink-0">
            <Tsumugi size={72} mood="happy" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-[11px] tracking-[0.22em] text-mute leading-none mb-2">
              {greeting}
            </p>
            <h1 className="font-serif font-medium text-[24px] md:text-[30px] leading-[1.25] text-ink tracking-[0.01em]">
              今日はどんな話を、紡ぎましょうか？
            </h1>
            <div className="hidden md:flex flex-wrap gap-2.5 mt-4">
              <Link href="/generate">
                <Btn kind="accent" icon="sparkle" size="md">テーマから自動生成</Btn>
              </Link>
              <Link href="/generate">
                <Btn kind="ghost" icon="pen" size="md">白紙から書く</Btn>
              </Link>
              {totalArticles > 0 && (
                <Link href="/library">
                  <Btn kind="quiet" icon="folder" size="md">下書きを開く</Btn>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 統計 — 3タイル横並びの一枚カード */}
        <div className="bg-paper border border-rule rounded-sm flex divide-x divide-rule shrink-0">
          <StatTile label="STREAK"     value={String(streak || 0)}  unit="days" />
          <StatTile label="PUBLISHED"  value={String(totalArticles)} unit="articles" />
          <StatTile label="WORDS / WK" value={formatK(weekWords)}    unit="+wow" accent />
        </div>
      </section>

      {/* ───── MAIN GRID ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-7 lg:gap-8">
        {/* ─── 左：DRAFTS ─── */}
        <section>
          <SectionHead
            kicker="DRAFTS · 進行中"
            title={
              articles.length > 0
                ? `書きかけの物語が、${articles.length}つあります`
                : "新しい物語を、はじめましょう"
            }
            right={
              <div className="flex gap-1.5">
                <Chip>すべて</Chip>
                <Chip active>下書き</Chip>
                <Chip>公開済</Chip>
              </div>
            }
          />

          {articles.length === 0 ? (
            <div className="bg-paper border border-rule rounded-sm py-14 px-5 flex flex-col items-center gap-4">
              <Tsumugi size={64} mood="idle" />
              <p className="font-serif text-sm text-mute text-center leading-relaxed">
                まだ記事がありません。<br />
                「テーマから自動生成」から、最初の一行を紡ぎましょう。
              </p>
              <Link href="/generate">
                <Btn kind="primary" size="sm" iconRight="arrow-right">最初の記事を生成</Btn>
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {articles.map((article, i) => {
                const target = LENGTH_TARGET[article.input.lengthPreference ?? "medium"];
                const progress = Math.min(100, Math.round((article.output.markdown.length / target) * 100));
                const hot = i === 0; // 最新が編集中
                return (
                  <li key={article.id}>
                    <DraftRow
                      href={`/editor/${article.id}`}
                      title={article.output.selectedTitle}
                      genre={article.input.genre}
                      chars={article.output.markdown.length}
                      status={STATUS_LABEL[article.status] ?? article.status}
                      progress={progress}
                      updatedAt={article.updatedAt}
                      hot={hot}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ─── 右：Quick Start + Suggestions ─── */}
        <aside className="flex flex-col gap-5">
          {/* QUICK START */}
          <div className="relative overflow-hidden bg-paper border border-rule rounded-sm p-5 md:p-6">
            <span
              aria-hidden="true"
              className="absolute -top-2 -right-3 font-display text-[80px] leading-none text-surface2 select-none pointer-events-none opacity-60"
            >NEW</span>
            <p className="relative font-display text-[10px] tracking-[0.2em] text-accent mb-2.5 leading-none">
              QUICK START
            </p>
            <p className="relative font-serif text-[16px] leading-[1.45] text-ink mb-3">
              テーマを一行、教えてください。<br />
              つむぎが構成案と下書きを用意します。
            </p>
            <form action="/generate" method="GET" className="relative">
              <div className="bg-surface border border-rule rounded-sm flex items-center gap-2 px-3 py-2.5">
                <input
                  name="theme"
                  type="text"
                  placeholder="例) 朝のコーヒーをゆっくり飲む、七分間の話"
                  className="flex-1 min-w-0 bg-transparent font-serif text-[14px] text-ink placeholder:text-mute-soft focus:outline-none"
                />
                <Btn kind="primary" size="sm" iconRight="arrow-right" type="submit">生成</Btn>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Chip>#エッセイ</Chip>
                <Chip>#1500字</Chip>
                <Chip>#やさしい口調</Chip>
                <Chip>+ 設定</Chip>
              </div>
            </form>
          </div>

          {/* つむぎから — 提案 */}
          <div className="bg-surface border border-rule rounded-sm p-5 md:p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <TsumugiTiny size={24} />
              <span className="font-sans font-medium text-[12px] text-ink-soft leading-none">つむぎから</span>
              <div className="flex-1" />
              <button
                type="button"
                aria-label="提案を再生成"
                className="text-mute hover:text-ink transition-colors"
              >
                <Icon name="reload" size={14} />
              </button>
            </div>
            <p className="font-serif text-[15px] leading-[1.5] text-ink mb-3">
              次のお題に使えそうな題材を、<span className="bg-highlight px-1">3つ</span>見つけました。
            </p>
            <ul className="flex flex-col gap-2">
              {SUGGESTIONS.map((s, i) => (
                <li key={i}>
                  <Link
                    href={`/generate?theme=${encodeURIComponent(s)}`}
                    className="group bg-paper border border-rule rounded-sm px-3 py-2.5 flex items-center gap-3 hover:bg-surface2 transition-colors"
                  >
                    <span className="font-display text-[14px] text-mute tracking-[0.1em] w-6 shrink-0 leading-none">
                      0{i + 1}
                    </span>
                    <span className="flex-1 font-sans text-[13px] leading-[1.4] text-ink-soft group-hover:text-ink transition-colors">
                      {s}
                    </span>
                    <Icon name="plus" size={14} className="text-mute group-hover:text-ink transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
            {/* 見守るつむぎ — 観察者として静かに置く */}
            <div className="mt-5 pt-4 border-t border-rule flex items-center justify-center">
              <Tsumugi size={72} mood="idle" />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ───────── 内部コンポーネント ───────── */

interface StatTileProps {
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
}
function StatTile({ label, value, unit, accent }: StatTileProps) {
  return (
    <div className="px-5 py-3.5 md:py-4 min-w-[100px]">
      <p className="font-display text-[10px] tracking-[0.18em] text-mute uppercase leading-none mb-1.5">
        {label}
      </p>
      <BigNum size={36} className={accent ? "text-accent" : "text-ink"}>{value}</BigNum>
      <p className="font-mono text-[10px] text-mute leading-none mt-0.5">{unit}</p>
    </div>
  );
}

interface DraftRowProps {
  href: string;
  title: string;
  genre?: string;
  chars: number;
  status: string;
  progress: number;
  updatedAt: string;
  hot?: boolean;
}
function DraftRow({ href, title, genre, chars, status, progress, updatedAt, hot }: DraftRowProps) {
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
        <p className="mt-1 font-sans text-[11px] md:text-[12px] text-mute flex items-center gap-1.5 flex-wrap">
          {genre && <span>{genre}</span>}
          {genre && <span className="text-rule">·</span>}
          <span className="font-mono">{chars.toLocaleString()}字</span>
          <span className="text-rule">·</span>
          <span>{status}</span>
        </p>
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
      <div className="hidden md:block w-[100px] shrink-0 text-right">
        <p className="font-mono text-[11px] text-mute leading-none">
          {new Date(updatedAt).toLocaleDateString("ja-JP")}
        </p>
      </div>
      <Icon name="arrow-right" size={16} className="text-ink shrink-0" />
    </Link>
  );
}
