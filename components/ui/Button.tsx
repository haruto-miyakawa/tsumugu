import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  hard?: boolean;
}

const BASE = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm text-[13px] font-sans font-medium tracking-[0.01em] transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none";

const VARIANTS: Record<Variant, string> = {
  primary:   "bg-accent text-paper hover:brightness-90 active:brightness-75",
  accent:    "bg-accent text-paper hover:brightness-90 active:brightness-75",
  secondary: "bg-surface border border-rule text-ink hover:bg-bg active:brightness-[0.97]",
  ghost:     "bg-transparent text-mute hover:text-ink hover:bg-surface border border-transparent",
  danger:    "bg-red-600 text-paper hover:bg-red-700",
};

export function Button({ variant = "primary", isLoading, hard: _hard, className = "", children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          処理中...
        </>
      ) : children}
    </button>
  );
}
