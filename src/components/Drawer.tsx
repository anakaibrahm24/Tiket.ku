import { cn } from "@/lib/utiils";
import { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Drawer = ({ open, title, children, onClose, className = "" }: DrawerProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-night-950/40">
      <div
        className={cn(
          "h-full w-full max-w-md bg-surface-white shadow-lg",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-line-soft p-5">
          <h2 className="font-title text-title-lg text-ink-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-500 hover:text-ink-900"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
