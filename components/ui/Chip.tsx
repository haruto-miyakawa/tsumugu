import type { HTMLAttributes, ReactNode } from "react";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  children: ReactNode;
}

const BASE =
  "inline-flex items-center gap-1 px-2.5 py-[5px] rounded-[9999px] " +
  "font-sans font-medium text-[11px] tracking-[0.02em] leading-none border";

export function Chip({ active = false, className = "", children, ...props }: ChipProps) {
  const variant = active
    ? "bg-accent text-paper border-accent"
    : "bg-surface text-ink-soft border-rule";
  return (
    <span className={`${BASE} ${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}
