import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function TextArea({ label, hint, className = "", ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-sans font-medium text-ink-sub">
          {label}
        </label>
      )}
      <textarea
        className={`bg-surface border border-rule text-ink text-sm font-sans rounded-sm px-3 py-2.5 focus:outline-none focus:border-accent transition-colors resize-y placeholder:text-faint ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-mute font-sans">{hint}</p>}
    </div>
  );
}
