import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  kicker?: string;
}

export function PageContainer({ children, title, kicker }: PageContainerProps) {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-9 pb-28 md:pb-12">
      {(kicker || title) && (
        <div className="mb-6 md:mb-8">
          {kicker && (
            <p className="font-display text-[11px] tracking-[0.22em] text-mute uppercase mb-2 leading-none">
              {kicker}
            </p>
          )}
          {title && (
            <h1 className="font-serif font-medium text-[24px] md:text-[30px] leading-[1.25] text-ink tracking-[0.01em]">
              {title}
            </h1>
          )}
        </div>
      )}
      {children}
    </main>
  );
}
