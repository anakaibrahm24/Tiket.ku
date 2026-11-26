import { cn } from "@/lib/utiils";
import { ReactNode } from "react";

interface BannerProps {
  title: string;
  description?: string;
  code?: string;
  icon?: string;
  className?: string;
  children?: ReactNode;
}

export const Banner = ({
  title,
  description,
  code,
  icon = "verified",
  className = "",
  children,
}: BannerProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-xl border border-line-soft bg-surface p-5",
        className
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand-deep">
        <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-title text-title-md text-ink-900">{title}</h3>
          {code ? (
            <span className="rounded-full border border-line-soft bg-surface-white px-2.5 py-0.5 font-mono text-mono-sm text-ink-600">
              {code}
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="font-body text-body-md text-ink-600">{description}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export default Banner;
