import Link from "next/link";
import { readJson, listArticleFiles, getArticlePath } from "@/lib/file-storage";
import { ArticleData, ArticleSummary } from "@/types/article";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Tsumugi } from "@/components/ui/Tsumugi";

const STATUS_LABEL: Record<ArticleSummary["status"], string> = {
  draft: "下書き", formatted: "整形済み", copied: "コピー済み",
};
const STATUS_CLASS: Record<ArticleSummary["status"], string> = {
  draft: "bg-surface text-mute",
  formatted: "bg-highlight text-ink-soft",
  copied: "bg-surface2 text-ink",
};
const LENGTH_TARGET: Record<string, number> = { short: 1000, medium: 2000, long: 3500 };

async function getAllArticles() {
  const files = await listArticleFiles();
  const list: (ArticleSummary & { progress: number; wordCount: number })[] = [];
  for (const f of files) {
    const a = await readJson<ArticleData>(getArticlePath(f.replace(".json", "")));
    if (!a) continue;
    const target = LENGTH_TARGET[a.input.lengthPreference ?? "medium"];
    list.push({
      id: a.id,
      title: a.output.selectedTitle,
      theme: a.input.theme,
      createdAt: a.createdAt,
      status: a.status,
      progress: Math.min(100, Math.round((a.output.markdown.length / target) * 100)),
      wordCount: a.output.markdown.length,
    });
  }
  return list;
}

export default async function FormatListPage() {
  const articles = await getAllArticles();

  return (
    <PageContainer kicker="LIBRARY" title="ライブラリ">
      <Card noPad>
        {articles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 px-6 text-center">
            <Tsumugi size={64} mood="idle" />
            <p className="text-sm text-mute">整形できる記事がありません。</p>
            <Link href="/generate" className="text-sm text-accent hover:underline">
              記事を生成する →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-rule">
            {articles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/format/${a.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-surface transition-colors group"
                >
                  <div className="w-1 self-stretch rounded-full bg-accent opacity-60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate group-hover:text-accent transition-colors">
                      {a.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 font-mono ${STATUS_CLASS[a.status]}`} style={{ borderRadius: "2px" }}>
                        {STATUS_LABEL[a.status]}
                      </span>
                      <span className="text-[11px] text-mute">{a.wordCount.toLocaleString()}字</span>
                      <span className="text-[11px] text-mute-soft">
                        {new Date(a.createdAt).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <div className="mt-2 h-1 bg-surface2 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${a.progress}%` }} />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className="text-lg text-accent leading-none"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {a.progress}%
                    </p>
                    <p className="text-[10px] text-mute mt-0.5 font-mono">開く →</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </PageContainer>
  );
}
