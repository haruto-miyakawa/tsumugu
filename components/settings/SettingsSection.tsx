interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/** Shared layout unit for a settings section. Drop-in for future sections. */
export function SettingsSection({ title, description, children }: Props) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="font-sans text-[15px] font-semibold text-ink tracking-wide">
          {title}
        </h2>
        {description && (
          <p className="text-[13px] font-sans text-mute mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="bg-paper border border-rule rounded-md shadow-card overflow-hidden">
        {children}
      </div>
    </section>
  );
}
