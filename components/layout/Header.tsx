"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { TsumugiTiny } from "@/components/mascot/TsumugiTiny";

const NAV = [
  { href: "/",         label: "ホーム" },
  { href: "/library",  label: "ライブラリ" },
  { href: "/settings", label: "設定" },
  { href: "/info",     label: "インフォ" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/library") return pathname.startsWith("/library") || pathname.startsWith("/preview");
  return pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  return (
    <header
      className="sticky top-0 z-40 bg-paper border-b border-rule"
      style={{ height: "68px" }}
    >
      <div className="max-w-6xl w-full h-full mx-auto px-4 md:px-8 flex items-center gap-7">
        {/* ロゴ */}
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-serif text-[28px] leading-none tracking-[0.04em] text-ink">
            つむぐ
          </span>
          <span className="font-mono text-[10px] leading-none tracking-[0.08em] text-mute">
            BETA
          </span>
        </Link>

        {/* デスクトップ・タブナビ — アンダーラインで active */}
        <nav className="hidden md:flex items-stretch gap-6 h-full">
          {NAV.map(({ href, label }) => {
            const active = isActive(href, pathname);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center font-sans text-[13px] font-medium"
                aria-current={active ? "page" : undefined}
              >
                <span className={active ? "text-ink" : "text-mute hover:text-ink transition-colors"}>
                  {label}
                </span>
                {active && (
                  <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-ink" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* スペーサー */}
        <div className="flex-1" />

        {/* 右端：検索 / ベル / アバター */}
        <div className="hidden md:flex items-center gap-4 text-ink-soft">
          <button
            type="button"
            aria-label="検索"
            className="hover:text-ink transition-colors"
          >
            <Icon name="search" size={18} />
          </button>
          <button
            type="button"
            aria-label="通知"
            className="hover:text-ink transition-colors"
          >
            <Icon name="bell" size={18} />
          </button>
          <div className="w-8 h-8 rounded-full bg-surface border border-rule flex items-center justify-center overflow-hidden">
            <TsumugiTiny size={28} />
          </div>
        </div>

        {/* モバイル右端：アバターだけ */}
        <div className="md:hidden flex items-center">
          <div className="w-8 h-8 rounded-full bg-surface border border-rule flex items-center justify-center overflow-hidden">
            <TsumugiTiny size={28} />
          </div>
        </div>
      </div>
    </header>
  );
}
