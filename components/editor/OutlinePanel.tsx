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
      <div className="p-4">
        {/* Section header */}
        <p className="font-mono text-[10px] tracking-widest text-mute uppercase mb-3">
          OUTLINE
        </p>

        {/* Heading list */}
        {headings.length === 0 ? (
          <p className="text-[12px] font-serif text-faint leading-relaxed">
            見出しがまだありません。<br />H2・H3 を追加すると<br />ここに表示されます。
          </p>
        ) : (
          <ul className="space-y-px">
            {headings.map((h, i) => {
              const isNow = i === nowIndex;
              return (
                <li key={i}>
                  <button
                    className={`w-full text-left rounded-sm transition-colors leading-snug py-1.5 ${
                      h.level === 1 ? "px-2" : h.level === 2 ? "px-3" : "px-5"
                    } ${
                      isNow
                        ? "bg-paper text-accent font-medium"
                        : "text-ink-sub hover:text-ink hover:bg-paper"
                    }`}
                  >
                    {isNow && (
                      <span className="block font-mono text-[9px] text-accent tracking-widest leading-none mb-0.5">
                        NOW
                      </span>
                    )}
                    <span className="text-[12px] font-sans">{h.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* AI observation — v2 placeholder */}
        <div className="mt-5 pt-4 border-t border-rule opacity-50 select-none">
          <p className="font-mono text-[10px] tracking-widest text-faint uppercase mb-2">
            AI · OUTLINE
            <span className="ml-1.5 normal-case font-sans tracking-normal text-[9px]">v2</span>
          </p>
          <p className="text-[11px] font-sans text-faint leading-relaxed">
            執筆内容を分析して、構成の改善案を提案します。
          </p>
          <p className="text-[10px] font-mono text-faint mt-2">— 準備中</p>
        </div>
      </div>
    </div>
  );
}
