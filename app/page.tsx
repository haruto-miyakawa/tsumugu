import Link from "next/link";
import { readJson, listArticleFiles, getArticlePath } from "@/lib/file-storage";
import { ArticleData } from "@/types/article";
import { Card } from "@/components/ui/Card";
import { Tsumugi } from "@/components/ui/Tsumugi";

const STATUS_LABEL: Record<string, string> = {
  draft: "下書き",
  formatted: "整形済み",
  copied: "コピー済み",
};
const STATUS_CLASS: Record<string, string> = {
  draft:     "bg-surface text-mute",
  formatted: "bg-marker text-ink-sub",
  copied:    "bg-surface text-ink",
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

  // Streak: consecutive days with activity going backwards from today
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

// Shared button-link classes (mirrors Button component's primary/secondary variants)
const btnPrimary =
  "inline-flex items-center gap-1.5 bg-accent text-paper text-[13px] font-sans font-medium tracking-[0.01em] px-4 py-2 rounded-sm hover:brightness-90 transition-all shrink-0";
const btnSecondary =
  "inline-flex items-center gap-1.5 bg-surface border border-rule text-ink text-[13px] font-sans font-medium tracking-[0.01em] px-4 py-2 rounded-sm hover:bg-bg transition-colors shrink-0";

export default async function DashboardPage() {
  const { greeting, articles, totalArticles, streak, weekWords } = await getData();

  const weekWordsDisplay = weekWords >= 1000
    ? `${(weekWords / 1000).toFixed(1)}K`
    : String(weekWords || 0);

  const STATS = [
    { label: "STREAK",     value: streak || 0,      unit: "days"     },
    { label: "PUBLISHED",  value: totalArticles,    unit: "articles"  },
    { label: "WORDS / WK", value: weekWordsDisplay, unit: "chars"     },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-28 md:pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5">

        {/* ━━━ Left / Row 1 — Greeting ━━━ */}
        <section className="bg-paper border border-rule rounded-md shadow-card p-5 md:p-7">
          <div className="flex gap-4 md:gap-6 items-start">
            <Tsumugi size={80} mood="happy" className="shrink-0 mt-1" />
            <div className="min-w-0">
              <p className="font-display text-[44px] md:text-[56px] leading-none text-ink tracking-wide">
                {greeting}
              </p>
              <p className="font-serif text-sm text-mute mt-1.5">
                今日はどんな話を、紡ぎましょうか？
              </p>
              {/* Desktop: CTAs — 実装済み機能のみ */}
              <div className="hidden md:flex flex-wrap gap-2 mt-4">
                <Link href="/generate" className={btnPrimary}>
                  テーマから自動生成
                </Link>
                {totalArticles > 0 && (
                  <Link href="/library" className={btnSecondary}>
                    下書きを開く
                  </Link>
                )}
              </div>
              {/* Mobile: inline quick-start input */}
              <form className="flex gap-2 mt-4 md:hidden" action="/generate" method="GET">
                <input
                  name="theme"
                  type="text"
                  placeholder="テーマを一行で…"
                  className="flex-1 min-w-0 bg-surface border border-rule text-ink text-sm font-sans rounded-sm px-3 py-2 focus:outline-none focus:border-accent transition-colors placeholder:text-faint"
                />
                <button
                  type="submit"
                  className="bg-accent text-paper text-[13px] font-sans font-medium rounded-sm px-4 py-2 hover:brightness-90 transition-all shrink-0"
                >
                  生成
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ━━━ Right / Row 1 — Stats ━━━ */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
          {STATS.map(({ label, value, unit }) => (
            <div
              key={label}
              className="bg-paper border border-rule rounded-md shadow-card px-3 py-3 lg:px-5 lg:py-4"
            >
              <p className="font-mono text-[10px] tracking-widest text-mute uppercase leading-none">
                {label}
              </p>
              <p className="font-display text-[32px] lg:text-[52px] leading-none text-ink mt-1">
                {value}
              </p>
              <p className="text-[11px] text-faint mt-0.5">{unit}</p>
            </div>
          ))}
        </div>

        {/* ━━━ Left / Row 2 — Drafts ━━━ */}
        <Card
          kicker="DRAFTS · 進行中"
          title={
            articles.length > 0
              ? `書きかけの記事が、${articles.length}つあります`
              : undefined
          }
          noPad
        >
          {articles.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 px-5">
              <Tsumugi size={52} mood="idle" />
              <p className="text-sm font-serif text-mute text-center leading-relaxed">
                まだ記事がありません。<br />「テーマから自動生成」から始めましょう。
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-rule">
              {articles.map((article) => {
                const target = LENGTH_TARGET[article.input.lengthPreference ?? "medium"];
                const progress = Math.min(100, Math.round((article.output.markdown.length / target) * 100));
                return (
                  <li key={article.id}>
                    <Link
                      href={`/editor/${article.id}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-surface transition-colors group"
                    >
                      <div className="w-[3px] self-stretch bg-accent opacity-60 shrink-0 rounded-full" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-sans font-medium text-ink truncate group-hover:text-accent transition-colors">
                          {article.output.selectedTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {article.input.genre && (
                            <span className="text-[11px] font-sans text-mute">
                              {article.input.genre}
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-mute">
                            {article.output.markdown.length.toLocaleString()}字
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-sm font-mono ${STATUS_CLASS[article.status]}`}
                          >
                            {STATUS_LABEL[article.status]}
                          </span>
                          <span className="text-[11px] text-faint ml-auto">
                            {new Date(article.updatedAt).toLocaleDateString("ja-JP")}
                          </span>
                        </div>
                        <div className="mt-2 h-[3px] bg-rule rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="font-display text-[28px] leading-none text-mute">{progress}</span>
                        <span className="block text-[9px] font-mono text-faint uppercase tracking-widest mt-0.5">% done</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* ━━━ Right / Row 2 — Quick Start + Suggestions ━━━ */}
        <div className="space-y-4">

          {/* Quick Start */}
          <div className="bg-paper border border-rule rounded-md shadow-card p-5">
            <p className="font-mono text-[10px] tracking-widest text-mute uppercase mb-2">
              QUICK START
            </p>
            <p className="text-xs font-sans text-ink-sub mb-3 leading-relaxed">
              テーマを一行、教えてください。<br className="hidden lg:block" />
              つむぎが構成案と下書きを用意します。
            </p>
            <form action="/generate" method="GET">
              <div className="flex gap-2">
                <input
                  name="theme"
                  type="text"
                  placeholder="例) 朝のコーヒーをゆっくり飲む話"
                  className="flex-1 min-w-0 bg-surface border border-rule text-ink text-[13px] font-sans rounded-sm px-3 py-2 focus:outline-none focus:border-accent transition-colors placeholder:text-faint"
                />
                <button
                  type="submit"
                  className="bg-accent text-paper text-[13px] font-sans font-medium rounded-sm px-3 py-2 hover:brightness-90 transition-all shrink-0"
                >
                  生成
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {["#エッセイ", "#1500字", "#やさしい口調"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono text-mute bg-surface border border-rule px-1.5 py-0.5 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </form>
          </div>

          {/* Tsumugi suggestions */}
          <Card kicker="つむぎから" noPad>
            <div className="p-5">
              <p className="text-xs font-serif text-mute mb-3 leading-relaxed">
                次のお題に使えそうな題材を、3つ見つけました。
              </p>
              <ul className="space-y-3">
                {SUGGESTIONS.map((s, i) => (
                  <li key={i}>
                    <Link
                      href={`/generate?theme=${encodeURIComponent(s)}`}
                      className="flex gap-3 group"
                    >
                      <span className="font-display text-accent text-[20px] leading-none shrink-0 mt-0.5">
                        0{i + 1}
                      </span>
                      <span className="text-sm font-serif text-ink-sub group-hover:text-accent transition-colors leading-snug">
                        {s}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-rule flex justify-center">
                <Tsumugi size={36} mood="wink" />
              </div>
            </div>
          </Card>

        </div>
      </div>
    </main>
  );
}
