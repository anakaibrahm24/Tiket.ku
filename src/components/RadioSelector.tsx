import { cn } from "@/lib/utiils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioSelectorProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RadioSelector = ({
  options,
  value,
  onChange,
  className = "",
}: RadioSelectorProps) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
              active
                ? "border-brand-blue bg-brand-tint"
                : "border-line-soft bg-surface-white hover:border-brand-blue"
            )}
          >
            <span
              className={cn(
                "mt-1 h-4 w-4 rounded-full border",
                active ? "border-brand-blue bg-brand-blue" : "border-ink-300"
              )}
            />
            <div className="flex flex-col gap-1">
              <span className="font-label text-label-lg text-ink-900">
                {option.label}
              </span>
              {option.description ? (
                <span className="font-body text-body-md text-ink-600">
                  {option.description}
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default RadioSelector;
