import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export type BtnKind = "primary" | "ghost" | "soft" | "accent" | "quiet";
export type BtnSize = "sm" | "md" | "lg";

interface BtnProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  kind?: BtnKind;
  size?: BtnSize;
  icon?: IconName;
  iconRight?: IconName;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
}

const SIZE: Record<BtnSize, string> = {
  sm: "h-[30px] px-3 text-[12px] gap-1.5",
  md: "h-9  px-4 text-[13px] gap-1.5",
  lg: "h-[46px] px-[22px] text-[14px] gap-2",
};

const ICON_SIZE: Record<BtnSize, number> = {
  sm: 14,
  md: 15,
  lg: 16,
};

const KIND: Record<BtnKind, string> = {
  primary: "bg-ink text-paper border-ink hover:brightness-110",
  ghost:   "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper",
  soft:    "bg-surface text-ink border-rule hover:bg-surface2",
  accent:  "bg-accent text-paper border-accent hover:brightness-95",
  quiet:   "bg-transparent text-mute border-transparent hover:text-ink",
};

const BASE =
  "inline-flex items-center justify-center font-sans font-medium tracking-[0.01em] " +
  "rounded-[9999px] border-[1.5px] cursor-pointer whitespace-nowrap " +
  "transition-[background-color,color,filter,border-color] " +
  "disabled:opacity-50 disabled:cursor-not-allowed select-none";

export function Btn({
  kind = "primary",
  size = "md",
  icon,
  iconRight,
  className = "",
  type = "button",
  children,
  ...props
}: BtnProps) {
  const cls = `${BASE} ${SIZE[size]} ${KIND[kind]} ${className}`;
  const iconSize = ICON_SIZE[size];
  return (
    <button type={type} className={cls} {...props}>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
