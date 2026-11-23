interface ScheduleCardProps {
  badge: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  onDetail: () => void;
}

export const ScheduleCard = ({
  badge,
  title,
  subtitle,
  date,
  time,
  venue,
  onDetail,
}: ScheduleCardProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line-soft bg-surface-subtle p-5">
      <span className="inline-flex w-fit items-center rounded-full bg-brand-blue px-2.5 py-1 text-xs font-medium text-surface-white">
        {badge}
      </span>
      <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
      <p className="text-sm text-ink-600">{subtitle}</p>
      <p className="text-sm font-medium text-ink-900">
        {date} • {time}
      </p>
      <p className="text-xs text-ink-500">{venue}</p>
      <button
        type="button"
        onClick={onDetail}
        className="mt-1 w-fit text-sm font-semibold text-brand-blue hover:text-brand-hover"
      >
        Lihat Detail
      </button>
    </div>
  );
};