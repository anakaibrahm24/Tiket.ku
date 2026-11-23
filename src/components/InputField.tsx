import { cn } from "@/lib/utiils";
import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";
import { Link } from "react-router-dom";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  labelName: string;
  error?: string;
  type?: "email" | "text" | "password";
  required: boolean;
  showForgotPasswordLink?: boolean;
  forgotPasswordPath?: string;
}
export const InputField = ({
  className = "",
  labelName,
  error,
  type = "text",
  required,
  showForgotPasswordLink,
  forgotPasswordPath = "#",
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={cn(
            "peer mt-0.5 w-full h-8 rounded border border-border px-4 pb-4.5 pt-5 sm:text-sm focus:border-primary focus:outline-none",
            className,
            error && "border-danger focus:border-danger",
            props.disabled && "cursor-not-allowed"
          )}
          {...props}
        />

        <span className="absolute inset-y-0 start-3 -translate-y-5.5 px-0.5 text-sm font-medium bg-surface-white text-ink-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5.5">
          {labelName}
          {required ? <span className="label-required">*</span> : null}
        </span>

        {isPassword && (
          <button
            type="button"
            onClick={
              props.disabled
                ? undefined
                : () => setShowPassword((prev) => !prev)
            }
            className={cn(
              "absolute inset-y-0 right-3 flex items-center text-ink-500 hover:text-ink-700 cursor-pointer",
              props.disabled && "cursor-not-allowed"
            )}
            aria-label={showPassword ? "Hide password" : "show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </label>
      <p className="text-xs text-danger pt-1 pl-1">{error ?? "\u00A0"}</p>

      {isPassword && (
        <div className="flex justify-end">
          {showForgotPasswordLink ? (
            <Link
              to={props.disabled ? "#" : forgotPasswordPath}
              onClick={(e) => {
                if (props.disabled) e.preventDefault(); // blokir navigasi
              }}
              className={cn(
                "text-xs text-primary hover:underline hover:text-primary-hover cursor-pointer",
                props.disabled &&
                  "text-ink-300 cursor-not-allowed hover:no-underline hover:text-ink-300"
              )}
            >
              Forgot password?
            </Link>
          ) : (
            <p className="text-xs">{"\u00A0"}</p>
          )}
        </div>
      )}
    </div>
  );
};
