export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-4 h-4 border-2", md: "w-8 h-8 border-[3px]", lg: "w-12 h-12 border-4" };
  return (
    <div className={`${sizes[size]} border-rule border-t-accent rounded-full animate-spin`} />
  );
}
