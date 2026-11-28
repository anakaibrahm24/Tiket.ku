import { cn } from "@/lib/utiils";

interface QrPassCardProps {
  title: string;
  subtitle?: string;
  code?: string;
  status?: string;
  className?: string;
}

export const QrPassCard = ({
  title,
  subtitle,
  code,
  status,
  className = "",
}: QrPassCardProps) => {
  return (
    <div className={cn("rounded-xl border border-line-soft bg-surface-white p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-title text-title-md text-ink-900">{title}</h3>
          {subtitle ? <p className="font-body text-body-md text-ink-600">{subtitle}</p> : null}
        </div>
        {status ? <span className="rounded-full bg-brand-tint px-3 py-1 font-label text-label-md text-brand-deep">{status}</span> : null}
      </div>
      <div className="mt-4 flex h-40 items-center justify-center rounded-lg border border-line-soft bg-surface-subtle">
        <span className="material-symbols-outlined text-5xl text-ink-500">qr_code_2</span>
      </div>
      {code ? <p className="mt-3 font-mono text-mono-sm text-ink-600">{code}</p> : null}
    </div>
  );
};

export default QrPassCard;
