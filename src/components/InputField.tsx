import { cn } from "@/lib/utiils";
import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";
import { Link } from "react-router-dom";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  labelName: string;
  error?: string;
  required?: boolean;
  showForgotPasswordLink?: boolean;
  forgotPasswordPath?: string;
}

export const InputField = ({
  className = "",
  labelName,
  error,
  required = false,
  showForgotPasswordLink = false,
  forgotPasswordPath = "#",
  type = "text",
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="font-label text-label-lg text-ink-900">
          {labelName}
          {required ? <span className="text-danger"> *</span> : null}
        </label>
        {isPassword && showForgotPasswordLink ? (
          <Link
            to={props.disabled ? "#" : forgotPasswordPath}
            className="font-label text-label-md text-brand-deep hover:text-brand-blue"
          >
            Lupa kata sandi?
          </Link>
        ) : null}
      </div>

      <div className="relative flex items-center">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={cn(
            "h-11 w-full rounded-lg border border-line-soft bg-surface-white px-3.5 font-body text-body-md text-ink-900 placeholder:text-ink-500 transition-colors focus:border-brand-blue focus:ring-1 focus:ring-brand-blue",
            error && "border-danger focus:border-danger focus:ring-danger",
            props.disabled && "cursor-not-allowed opacity-50",
            className
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() =>
              props.disabled ? undefined : setShowPassword((prev) => !prev)
            }
            className={cn(
              "absolute right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:text-ink-900",
              props.disabled && "cursor-not-allowed"
            )}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : null}
      </div>
      <p className="font-label text-label-md text-danger">
        {error ?? "\u00A0"}
      </p>
    </div>
  );
};

export default InputField;
