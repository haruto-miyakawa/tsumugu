interface ImgPlaceholderProps {
  width?: number | string;
  height?: number | string;
  label?: string;
  className?: string;
}

export function ImgPlaceholder({
  width = "100%",
  height = 180,
  label = "image",
  className = "",
}: ImgPlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden border border-dashed border-rule rounded-sm flex items-center justify-center ${className}`}
      style={{
        width,
        height,
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-surface2) 0 8px, var(--color-surface) 8px 16px)",
      }}
    >
      <span
        className="bg-paper px-2 py-1 rounded-[2px] font-mono font-medium text-[10px] leading-none text-mute uppercase tracking-[0.04em]"
        style={{ boxShadow: "inset 0 0 0 1px var(--color-rule)" }}
      >
        {label}
      </span>
    </div>
  );
}
