import { cn } from "@/lib/utiils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  type?: "button" | "submit" | "reset";
}
export const Button = ({
  label,
  onClick,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "cursor-pointer transition-all flex items-center justify-center",
        className,
        props.disabled && "cursor-not-allowed opacity-50"
      )}
      type={type}
      onClick={onClick}
      {...props}
    >
      {props.disabled && (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
      )}
      {props.disabled ? "Loading..." : label}
    </button>
  );
};
