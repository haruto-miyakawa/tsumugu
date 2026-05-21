"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/*
 * Layout:  [ホーム]   [ライブラリ]   [設定]    ← justify-around, 3 items
 *                        [+]                  ← absolute left-1/2, floats above nav
 *
 * Positioning note:
 *   `position: fixed` already creates a stacking/containing context for
 *   absolutely-positioned children. We must NOT add `relative` alongside
 *   `fixed` — in Tailwind's CSS output `relative` appears after `fixed`,
 *   so it would win and the nav would scroll with the page instead of
 *   sticking to the bottom. Only `fixed` is set here.
 */

const TABS = [
  {
    href: "/",
    label: "ホーム",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 11L12 4l9 7v9a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-9z" />
      </svg>
    ),
  },
  {
    href: "/library",
    label: "ライブラリ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "設定",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) ||
        (href === "/library" && pathname.startsWith("/preview"));

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-paper border-t border-rule flex justify-around items-center"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        height: "calc(56px + env(safe-area-inset-bottom))",
      }}
    >
      {/* 3 nav items — equally spaced, full 56px tap target each */}
      {TABS.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center justify-center gap-0.5 h-[56px] px-4 transition-colors ${
            isActive(href) ? "text-accent" : "text-mute"
          }`}
        >
          <span style={{ stroke: "currentColor" }}>{icon}</span>
          <span className="text-[10px]" style={{ fontFamily: "var(--font-mono)" }}>
            {label}
          </span>
        </Link>
      ))}

      {/*
       * FAB wrapper: paper-colored ring that lifts the + button visually
       * above the nav bar and separates it from the ライブラリ icon below.
       *
       * bottom: calc(100% + 2px)
       *   100%  = nav full height (56px + safe-area)
       *   + 2px = small gap so wrapper bottom is 2px above nav top border
       *   → entire FAB + ring floats above the nav, zero overlap
       *
       * bg-paper rounded-full p-[5px]
       *   white ring of 5px around the orange FAB circle
       *   visually distinct from nav's bg-paper background via shadow
       */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-paper rounded-full p-[5px] shadow-float"
        style={{ bottom: "calc(100% + 2px)" }}
      >
        <Link
          href="/generate"
          className="flex w-12 h-12 bg-accent text-paper rounded-full items-center justify-center transition-transform active:scale-95"
          aria-label="新しい記事を生成"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="w-6 h-6"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
