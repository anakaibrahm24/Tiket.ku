import { cn } from "@/lib/utiils";

interface StepperProps {
  steps: string[];
  activeIndex: number;
  className?: string;
}

export const Stepper = ({ steps, activeIndex, className = "" }: StepperProps) => {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {steps.map((step, index) => {
        const active = index === activeIndex;
        const done = index < activeIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full font-label text-label-md",
                done || active
                  ? "bg-brand-blue text-surface-white"
                  : "bg-surface-muted text-ink-500"
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "font-body text-body-md",
                active ? "text-ink-900" : "text-ink-500"
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
