import { FooterLinks } from "./FooterLinks";

export const Footer = () => {
  return (
    <footer className="border-t border-line-soft bg-surface-subtle py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-8">
        <p className="text-sm text-ink-600">
          © 2026 Tiket.ku — Stadion Gelora Bung Karno
        </p>
        <FooterLinks />
      </div>
    </footer>
  );
};