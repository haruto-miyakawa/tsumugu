interface Heading {
  level: number;
  text: string;
}

interface Props {
  headings: Heading[];
  isMobile?: boolean;
}

export function OutlinePanel({ headings, isMobile }: Props) {
  // Phase 2: determine current heading from editor scroll position
  // Phase 1: highlight the first H2 as a placeholder "NOW" indicator
  const nowIndex = headings.findIndex((h) => h.level === 2);

  return (
    <div
      className={`bg-surface border-r border-rule overflow-y-auto flex-shrink-0 ${
        isMobile ? "w-full" : "w-[220px]"
      }`}
    >
      <div className="p-5 flex flex-col gap-3.5">
        {/* Section header — display font kicker per blueprint */}
        <div className="flex items-center justify-between">
          <p className="font-display text-[11px] tracking-[0.2em] text-mute leading-none uppercase">
            OUTLINE
          </p>
          <span className="font-mono text-[10px] text-mute-soft leading-none">
            {headings.length}
          </span>
        </div>

        {/* Heading list */}
        {headings.length === 0 ? (
          <p className="text-[12px] font-serif text-mute-soft leading-relaxed">
            見出しがまだありません。<br />
            H2・H3 を追加すると<br />
            ここに表示されます。
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {headings.map((h, i) => {
              const isNow = i === nowIndex;
              // State per blueprint: done (gray), writing (accent), idea (mint), todo (mute-soft)
              const state: "done" | "writing" | "todo" = isNow
                ? "writing"
                : i < nowIndex
                ? "done"
                : "todo";
              return (
                <li key={i}>
                  <OutlineRow heading={h} state={state} isNow={isNow} />
                </li>
              );
            })}
          </ul>
        )}

        {/* AI observation — v2 placeholder */}
        <div className="mt-3 p-3 bg-paper border border-rule rounded-sm opacity-60">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-accent shrink-0"
            >
              <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
              <path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
            </svg>
            <span className="font-display text-[10px] tracking-[0.18em] text-accent leading-none">
              AI · OUTLINE
            </span>
          </div>
          <p className="text-[11px] font-sans text-mute leading-[1.5]">
            執筆内容を分析して、構成の改善案を提案します。
          </p>
          <p className="font-mono text-[10px] text-mute-soft mt-1.5 leading-none">— 準備中</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Helper row ─── */
interface OutlineRowProps {
  heading: Heading;
  state: "done" | "writing" | "idea" | "todo";
  isNow: boolean;
}
function OutlineRow({ heading, state, isNow }: OutlineRowProps) {
  const dotCls = {
    done: "bg-mute",
    writing: "bg-accent",
    idea: "bg-accent-mint",
    todo: "bg-mute-soft",
  }[state];

  const indent = heading.level === 1 ? "" : heading.level === 2 ? "ml-0" : "ml-3";

  return (
    <button
      type="button"
      className={`w-full text-left rounded-sm py-2 px-2 flex items-center gap-2.5 transition-colors group ${indent} ${
        isNow ? "bg-paper" : "hover:bg-paper/60"
      }`}
      style={isNow ? { boxShadow: "inset 0 0 0 1px var(--color-rule)" } : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotCls}`} aria-hidden="true" />
      <span
        className={`flex-1 min-w-0 truncate font-serif text-[13px] leading-[1.3] ${
          isNow ? "text-ink font-medium" : state === "done" ? "text-mute" : "text-ink-soft group-hover:text-ink"
        }`}
      >
        {heading.text || <span className="text-mute-soft italic">無題</span>}
      </span>
      {isNow && (
        <span className="font-display text-[9px] tracking-[0.1em] text-paper bg-accent rounded-full px-1.5 py-0.5 leading-none shrink-0">
          NOW
        </span>
      )}
    </button>
  );
}
