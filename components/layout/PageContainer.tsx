import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  kicker?: string;
}

export function PageContainer({ children, title, kicker }: PageContainerProps) {
  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-28 md:pb-10">
      {(kicker || title) && (
        <div className="mb-6 md:mb-8">
          {kicker && (
            <p
              className="text-[11px] tracking-widest text-mute mb-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {kicker}
            </p>
          )}
          {title && (
            <h1 className="text-2xl md:text-3xl font-semibold text-ink">{title}</h1>
          )}
        </div>
      )}
      {children}
    </main>
  );
}
