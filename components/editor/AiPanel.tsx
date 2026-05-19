import { Tsumugi } from "@/components/ui/Tsumugi";

interface Props {
  isMobile?: boolean;
}

const QUICK_ACTIONS = ["もっと柔らかく", "具体例を3つ", "結びを書く"];

export function AiPanel({ isMobile }: Props) {
  return (
    <div
      className={`bg-surface border-l border-rule flex flex-col overflow-hidden flex-shrink-0 ${
        isMobile ? "w-full" : "w-[280px]"
      }`}
    >
      {/* ── Header ── */}
      <div className="shrink-0 flex items-center gap-2.5 px-4 py-3 border-b border-rule">
        <Tsumugi size={28} mood="thinking" className="shrink-0" />
        <div className="min-w-0">
          <p className="text-[12px] font-sans font-medium text-ink leading-none">つむぎ</p>
          <p className="text-[10px] font-mono text-mute mt-0.5 truncate">聞き役 · 編集者モード</p>
        </div>
        <span className="ml-auto font-mono text-[9px] text-faint shrink-0">v2.4</span>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Greeting */}
        <p className="text-[12px] font-serif text-ink-sub leading-relaxed">
          おかえりなさい。<br />続きから始めましょうか？
        </p>

        {/* AI suggestion card */}
        <div className="bg-paper border border-rule rounded-md p-3 space-y-2.5">
          <p className="text-[11px] font-serif text-ink leading-relaxed">
            「七分」という数字に納得感がほしい。理由を補強できる？
          </p>
          <blockquote className="border-l-2 border-rule pl-2.5">
            <p className="text-[11px] font-serif text-mute italic leading-relaxed">
              経験則として書かれていますが、湯気の温度推移を1行入れると説得力が増しそうです。
            </p>
          </blockquote>
          {/* Dummy actions (Phase 3 で有効化) */}
          <div className="flex gap-1.5 pt-0.5">
            <button
              disabled
              className="text-[11px] font-sans text-ink-sub bg-surface border border-rule px-2.5 py-1 rounded-sm opacity-50 cursor-not-allowed"
            >
              挿入
            </button>
            <button
              disabled
              className="text-[11px] font-sans text-mute border border-rule px-2.5 py-1 rounded-sm opacity-50 cursor-not-allowed"
            >
              書き直し
            </button>
          </div>
        </div>

        {/* Quick action chips */}
        <div>
          <p className="font-mono text-[10px] tracking-widest text-faint uppercase mb-2">
            クイックアクション
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_ACTIONS.map((label) => (
              <button
                key={label}
                disabled
                className="text-[11px] font-sans text-ink-sub bg-paper border border-rule px-2.5 py-1 rounded-sm opacity-50 cursor-not-allowed"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Tsumugi icon */}
        <div className="flex justify-center pt-2">
          <Tsumugi size={32} mood="wink" />
        </div>
      </div>

      {/* ── Input (Phase 3 で有効化) ── */}
      <div className="shrink-0 border-t border-rule p-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="つむぎに頼む…"
            disabled
            className="flex-1 min-w-0 bg-surface border border-rule text-ink text-[12px] font-sans rounded-sm px-3 py-2 placeholder:text-faint disabled:opacity-50"
          />
          <button
            disabled
            className="bg-accent text-paper text-[13px] font-sans font-medium px-3 py-2 rounded-sm disabled:opacity-40 shrink-0"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
