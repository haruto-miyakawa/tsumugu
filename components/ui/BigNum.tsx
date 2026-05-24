import type { CSSProperties, ReactNode } from "react";

interface BigNumProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function BigNum({ size = 56, className = "", style, children }: BigNumProps) {
  return (
    <span
      className={`font-display text-ink ${className}`}
      style={{
        display: "inline-block",
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: "0.02em",
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
