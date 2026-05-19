import { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-sans font-medium text-ink-sub">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full bg-surface border border-rule text-ink text-sm font-sans rounded-sm pl-3 pr-8 py-2 focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-mute">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  );
}
