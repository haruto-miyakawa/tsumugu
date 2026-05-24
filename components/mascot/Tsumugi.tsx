import type { CSSProperties } from "react";

export type TsumugiMood = "idle" | "thinking" | "happy" | "wink" | "writing";

interface TsumugiProps {
  size?: number;
  mood?: TsumugiMood;
  accent?: string;
  tone?: string;
  className?: string;
  style?: CSSProperties;
}

const STROKE = "#1B1A17";
const SW = 2.2;

export function Tsumugi({
  size = 72,
  mood = "idle",
  accent = "var(--color-accent)",
  tone = "var(--color-surface)",
  className,
  style,
}: TsumugiProps) {
  return (
    <svg
      viewBox="0 0 100 110"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ display: "block", flex: "0 0 auto", ...style }}
    >
      {/* 影 */}
      <ellipse cx="50" cy="102" rx="22" ry="3" fill="#1B1A17" opacity="0.08" />

      {/* 頭の結び目（"紡ぐ" モチーフ） */}
      <path
        d="M44 22 C 44 12, 56 12, 56 22 C 56 28, 50 28, 50 22 C 50 16, 44 16, 44 22 Z"
        fill={accent}
        stroke={STROKE}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M50 28 L 50 34" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" />

      {/* 本体 — 豆/しずく型 */}
      <path
        d="M50 34
           C 22 34, 16 60, 22 78
           C 28 96, 72 96, 78 78
           C 84 60, 78 34, 50 34 Z"
        fill={tone}
        stroke={STROKE}
        strokeWidth={SW + 0.2}
        strokeLinejoin="round"
      />

      {/* ほっぺ */}
      <ellipse cx="32" cy="68" rx="4.5" ry="3" fill={accent} opacity="0.55" />
      <ellipse cx="68" cy="68" rx="4.5" ry="3" fill={accent} opacity="0.55" />

      {/* 目 — 表情ごと */}
      {mood === "idle" && (
        <g fill={STROKE}>
          <circle cx="40" cy="58" r="2.8" />
          <circle cx="60" cy="58" r="2.8" />
        </g>
      )}
      {mood === "thinking" && (
        <g fill="none" stroke={STROKE} strokeWidth={SW} strokeLinecap="round">
          <path d="M36 60 q4 -4 8 0" />
          <path d="M56 60 q4 -4 8 0" />
        </g>
      )}
      {mood === "happy" && (
        <g fill="none" stroke={STROKE} strokeWidth={SW} strokeLinecap="round">
          <path d="M36 60 q4 -5 8 0" />
          <path d="M56 60 q4 -5 8 0" />
        </g>
      )}
      {mood === "wink" && (
        <g stroke={STROKE} strokeWidth={SW} strokeLinecap="round" fill={STROKE}>
          <circle cx="40" cy="58" r="2.8" />
          <path d="M55 58 q5 -3 10 0" fill="none" />
        </g>
      )}
      {mood === "writing" && (
        <g fill={STROKE}>
          <circle cx="40" cy="58" r="2.2" />
          <circle cx="60" cy="58" r="2.2" />
          <rect x="62" y="64" width="22" height="3" rx="1.5" transform="rotate(20 62 64)" fill="#1B1A17" />
          <rect x="80" y="62" width="6" height="5" rx="1" transform="rotate(20 80 62)" fill={accent} />
        </g>
      )}

      {/* 口 */}
      {mood !== "writing" ? (
        <path
          d="M44 74 q6 5 12 0"
          stroke={STROKE}
          strokeWidth={SW}
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M46 75 q4 2 8 0"
          stroke={STROKE}
          strokeWidth={SW}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
