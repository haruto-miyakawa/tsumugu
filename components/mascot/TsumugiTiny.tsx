import type { CSSProperties } from "react";

interface TsumugiTinyProps {
  size?: number;
  accent?: string;
  tone?: string;
  className?: string;
  style?: CSSProperties;
}

const STROKE = "#1B1A17";

export function TsumugiTiny({
  size = 24,
  accent = "var(--color-accent)",
  tone = "var(--color-surface)",
  className,
  style,
}: TsumugiTinyProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      style={{ display: "block", flex: "0 0 auto", ...style }}
    >
      <circle cx="20" cy="20" r="17" fill={tone} stroke={STROKE} strokeWidth="1.6" />
      <circle cx="14" cy="20" r="1.6" fill={STROKE} />
      <circle cx="26" cy="20" r="1.6" fill={STROKE} />
      <path d="M16 26 q4 3 8 0" stroke={STROKE} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <ellipse cx="11" cy="24" rx="2" ry="1.4" fill={accent} opacity="0.6" />
      <ellipse cx="29" cy="24" rx="2" ry="1.4" fill={accent} opacity="0.6" />
    </svg>
  );
}
