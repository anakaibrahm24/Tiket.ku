import { cn } from "@/lib/utiils";
import { Button } from "./Button";
import { ReactNode } from "react";

interface CardActionProps {
  media?: ReactNode;
  category?: string;
  status?: string;
  date?: string;
  title: string;
  location?: string;
  price?: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
  className?: string;
}

export const CardAction = ({
  media,
  category,
  status,
  date,
  title,
  location,
  price,
  actionLabel = "Pilih Kursi",
  onAction,
  disabled = false,
  className = "",
}: CardActionProps) => {
  return (
    <article
      className={cn(
        "flex flex-col justify-between overflow-hidden rounded-xl border border-line-soft bg-surface-white shadow-sm transition-colors duration-150",
        disabled ? "opacity-80" : "hover:border-brand-blue",
        className
      )}
    >
      <div className="relative aspect-[16/10] flex flex-col items-center justify-center gap-1.5 border-b border-line-soft bg-surface-subtle text-ink-500">
        {media ?? <span className="material-symbols-outlined text-headline-md">image</span>}
        {category ? (
          <span className="absolute left-3 top-3 rounded-full bg-night-950 px-3 py-1 font-label text-label-md text-surface-white">
            {category}
          </span>
        ) : null}
        {status ? (
          <span className="absolute right-3 top-3 rounded-full bg-brand-tint px-3 py-1 font-label text-label-md text-brand-deep">
            {status}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 p-5">
        {date ? <p className="font-label text-label-md text-brand-deep tabular-nums">{date}</p> : null}
        <h3 className="font-title text-title-md text-ink-900">{title}</h3>
        {location ? (
          <p className="flex items-center gap-1.5 font-body text-body-md text-ink-600">
            <span className="material-symbols-outlined text-body-lg text-ink-500" aria-hidden="true">
              location_on
            </span>
            {location}
          </p>
        ) : null}
      </div>
      {price || actionLabel ? (
        <div className="flex items-center justify-between gap-4 border-t border-line-soft p-5">
          {price ? (
            <div className="flex flex-col">
              <span className="font-label text-label-md text-ink-500">Mulai dari</span>
              <span className="font-mono text-mono-md text-ink-900 tabular-nums">{price}</span>
            </div>
          ) : null}
          <Button
            type="button"
            label={actionLabel}
            variant={disabled ? "disabled" : "primary"}
            onClick={onAction}
            disabled={disabled}
          />
        </div>
      ) : null}
    </article>
  );
};

export default CardAction;
