import { cn } from "@/lib/utiils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "sky" | "neutral" | "outline" | "dark" | "status" | "timer";
  className?: string;
}

export const Badge = ({ children, variant = "neutral", className = "" }: BadgeProps) => {
  const variants: Record<string, string> = {
    brand: "bg-brand-blue text-surface-white",
    sky: "bg-brand-sky text-ink-900",
    neutral: "bg-surface-muted text-ink-700",
    outline: "border border-line-soft text-ink-900 bg-transparent",
    dark: "bg-night-950 text-surface-white",
    status: "bg-brand-tint text-brand-deep",
    timer: "bg-brand-tint text-brand-deep font-mono text-mono-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-label text-label-md",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
