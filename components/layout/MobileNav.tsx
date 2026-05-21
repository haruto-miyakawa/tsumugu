"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/*
 * X-style 5-slot bottom nav — NO absolute positioning, NO empty slots.
 *
 *   [ホーム] [ライブラリ] [+ FAB] [設定] [インフォ]
 *   flex-1    flex-1      flex-1  flex-1   flex-1
 *
 * The FAB is literally the 3rd flex-1 item. Inside its slot the button
 * uses -translate-y-[18px] to pop visually above the nav bar without
 * disturbing the flex layout or blocking adjacent tap targets.
 *
 * CRITICAL: never add `relative` alongside `fixed` — Tailwind outputs
 * `relative` after `fixed`, so it would win and the nav would scroll.
 */

export function MobileNav() {
  const pathname = usePathname();

  const active = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) ||
        (href === "/library" && pathname.startsWith("/preview"));

  const tabCls = (href: string) =>
    `flex-1 flex flex-col items-center justify-center gap-0.5 h-full transition-colors ${
      active(href) ? "text-accent" : "text-mute"
    }`;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-paper border-t border-rule flex items-stretch"
      style={{
        height: "calc(56px + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* 1 ─ ホーム */}
      <Link href="/" className={tabCls("/")}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ stroke: "currentColor" }}>
          <path d="M3 11L12 4l9 7v9a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-9z" />
        </svg>
        <span className="text-[9px]" style={{ fontFamily: "var(--font-mono)" }}>ホーム</span>
      </Link>

      {/* 2 ─ ライブラリ */}
      <Link href="/library" className={tabCls("/library")}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ stroke: "currentColor" }}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="text-[9px]" style={{ fontFamily: "var(--font-mono)" }}>ライブラリ</span>
      </Link>

      {/* 3 ─ FAB (center slot) — pops above nav via -translate-y */}
      <Link
        href="/generate"
        className="flex-1 flex items-center justify-center"
        aria-label="新しい記事を生成"
      >
        {/*
         * -translate-y-[18px]: visually lifts the button ~18px above center.
         * On a 56px nav the button center sits at 28-18=10px from nav top,
         * protruding ~10px above the nav's top border.
         * The tap target stays within the flex-1 slot — no overlap with neighbors.
         */}
        <div className="w-[52px] h-[52px] bg-accent text-paper rounded-full flex items-center justify-center shadow-float -translate-y-[18px] transition-transform active:scale-95">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-5 h-5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </Link>

      {/* 4 ─ 設定 */}
      <Link href="/settings" className={tabCls("/settings")}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ stroke: "currentColor" }}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
        <span className="text-[9px]" style={{ fontFamily: "var(--font-mono)" }}>設定</span>
      </Link>

      {/* 5 ─ インフォ */}
      <Link href="/info" className={tabCls("/info")}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ stroke: "currentColor" }}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="8.5" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="11.5" x2="12" y2="16" />
        </svg>
        <span className="text-[9px]" style={{ fontFamily: "var(--font-mono)" }}>インフォ</span>
      </Link>
    </nav>
  );
}
