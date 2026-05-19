import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  kicker?: string;
  noPad?: boolean;
}

export function Card({ title, kicker, noPad, children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-paper border border-rule rounded-md shadow-card ${className}`}
      {...props}
    >
      {(kicker || title) && (
        <div className="px-5 py-4 border-b border-rule">
          {kicker && (
            <p className="font-mono text-[10px] tracking-widest text-mute uppercase mb-0.5">{kicker}</p>
          )}
          {title && (
            <h2 className="text-sm font-sans font-semibold text-ink">{title}</h2>
          )}
        </div>
      )}
      <div className={noPad ? "" : "p-5"}>{children}</div>
    </div>
  );
}
