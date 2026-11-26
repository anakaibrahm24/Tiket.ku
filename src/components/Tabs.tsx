import { cn } from "@/lib/utiils";

interface TabItem {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs = ({ items, activeId, onChange, className = "" }: TabsProps) => {
  return (
    <div className={cn("flex flex-wrap items-center gap-6 border-b border-line-soft pt-2", className)}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              "inline-flex items-center gap-2 border-b-2 pb-3.5 transition-colors duration-150 ease-out",
              active
                ? "border-brand-blue text-ink-900"
                : "border-transparent text-ink-500 hover:text-ink-900"
            )}
          >
            {item.icon ? (
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            <span className="font-label text-label-lg">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
