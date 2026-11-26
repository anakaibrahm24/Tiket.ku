import { cn } from "@/lib/utiils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  children?: ReactNode;
  variant?:
    | "primary"
    | "with-icon"
    | "secondary"
    | "icon"
    | "oauth"
    | "glass"
    | "disabled";
  icon?: ReactNode;
}

export const Button = ({
  label,
  children,
  variant = "primary",
  icon,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const variants: Record<string, string> = {
    primary:
      "bg-brand-blue hover:bg-brand-deep text-surface-white px-6 py-3 rounded-lg",
    "with-icon":
      "bg-brand-blue hover:bg-brand-deep text-surface-white px-6 py-3 rounded-lg",
    secondary:
      "bg-surface-white hover:bg-surface-subtle text-ink-900 border border-line-soft px-6 py-3 rounded-lg",
    icon: "w-11 h-11 rounded-lg border border-line-soft bg-surface-white hover:bg-surface-subtle text-ink-900",
    oauth:
      "w-full bg-surface-white hover:bg-surface-subtle text-ink-900 border border-line-soft px-6 py-3.5 rounded-lg shadow-sm",
    glass:
      "bg-surface-white/10 hover:bg-surface-white/20 text-surface-white border border-line-on-dark px-6 py-3 rounded-lg",
    disabled:
      "bg-surface-muted text-ink-300 px-6 py-3 rounded-lg cursor-not-allowed opacity-70",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-label text-label-lg transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue cursor-pointer",
        variants[variant],
        className,
        props.disabled && "cursor-not-allowed opacity-50"
      )}
      {...props}
    >
      {icon}
      {children ?? label}
    </button>
  );
};

export default Button;
