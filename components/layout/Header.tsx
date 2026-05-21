"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/",        label: "ホーム" },
  { href: "/generate", label: "エディタ" },
  { href: "/library", label: "ライブラリ" },
  { href: "/style",   label: "スタイル" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header
      className="sticky top-0 z-40 bg-paper border-b border-rule flex items-center"
      style={{ height: "68px" }}
    >
      <div className="max-w-5xl w-full mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-2xl text-ink tracking-wider"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            つむぐ
          </span>
          <span
            className="text-[10px] text-mute bg-surface border border-rule px-1.5 py-0.5"
            style={{ fontFamily: "var(--font-mono)", borderRadius: "2px" }}
          >
            BETA
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== "/" && (pathname.startsWith(href) || (href === "/library" && pathname.startsWith("/preview"))));
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  active
                    ? "bg-surface text-ink font-medium"
                    : "text-mute hover:text-ink hover:bg-surface"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
