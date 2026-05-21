interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled = false }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[13px] font-sans text-ink">{label}</p>
        {description && (
          <p className="text-[11px] font-sans text-mute mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          "relative inline-flex shrink-0 w-10 h-[22px] rounded-full transition-colors duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
          checked ? "bg-accent" : "bg-faint",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-[3px] h-4 w-4 rounded-full bg-paper transition-transform duration-200",
            "shadow-[0_1px_3px_rgba(0,0,0,0.15)]",
            checked ? "translate-x-[22px]" : "translate-x-[3px]",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
