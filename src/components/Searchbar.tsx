import { cn } from "@/lib/utiils";
import { Button } from "./Button";

interface SearchbarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export const Searchbar = ({
  placeholder = "Placeholder pencarian...",
  onSearch,
  className = "",
}: SearchbarProps) => {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const value = new FormData(e.currentTarget).get("q")?.toString() ?? "";
        onSearch?.(value);
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border border-line-soft bg-surface-white p-1.5 shadow-sm focus-within:border-brand-blue",
        className
      )}
    >
      <span className="material-symbols-outlined pl-3 text-title-lg text-ink-500">
        search
      </span>
      <input
        name="q"
        type="search"
        aria-label="Kolom pencarian"
        placeholder={placeholder}
        className="w-full border-0 bg-transparent px-3 py-2.5 font-body text-body-md text-ink-900 placeholder:text-ink-500 focus:ring-0"
      />
      <Button type="submit" label="Cari" variant="primary" className="shrink-0" />
    </form>
  );
};

export default Searchbar;
