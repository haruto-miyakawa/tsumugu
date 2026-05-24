import type { ReactNode } from "react";

interface SectionHeadProps {
  kicker?: string;
  title?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function SectionHead({ kicker, title, right, className = "" }: SectionHeadProps) {
  return (
    <div
      className={`flex items-end justify-between gap-4 mb-4 ${className}`}
    >
      <div className="min-w-0">
        {kicker && (
          <p className="font-display text-[11px] tracking-[0.22em] text-mute uppercase mb-1.5 leading-none">
            {kicker}
          </p>
        )}
        {title && (
          <h2 className="font-serif font-medium text-[22px] leading-[1.2] text-ink tracking-[0.01em]">
            {title}
          </h2>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
