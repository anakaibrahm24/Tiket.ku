import { cn } from "@/lib/utiils";
import { ReactNode } from "react";

interface SummaryCardProps {
  title?: string;
  children: ReactNode;
  totalLabel?: string;
  totalValue?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const SummaryCard = ({
  title = "Ringkasan",
  children,
  totalLabel = "Total",
  totalValue,
  actionLabel,
  onAction,
  className = "",
}: SummaryCardProps) => {
  return (
    <div className={cn("rounded-xl border border-line-soft bg-surface-white p-5 shadow-sm", className)}>
      <h3 className="font-title text-title-lg text-ink-900">{title}</h3>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
      {totalValue ? (
        <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-4">
          <span className="font-label text-label-lg text-ink-600">{totalLabel}</span>
          <span className="font-mono text-mono-md text-ink-900">{totalValue}</span>
        </div>
      ) : null}
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 w-full rounded-lg bg-brand-blue px-6 py-3 font-label text-label-lg text-surface-white transition-colors hover:bg-brand-deep"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default SummaryCard;
