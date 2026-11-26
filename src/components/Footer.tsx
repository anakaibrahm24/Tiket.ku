import { FooterLinks } from "./FooterLinks";

export const Footer = () => {
  return (
    <footer className="border-t border-line-soft bg-surface-subtle">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center lg:px-16">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-surface-white">
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">
              confirmation_number
            </span>
          </span>
          <span className="font-display text-title-md text-ink-900">Tiket.ku</span>
          <span className="ml-2 font-body text-body-md text-ink-600">
            Platform resmi pemesanan tiket kawasan Stadion GBK.
          </span>
        </div>
        <p className="font-label text-label-md text-ink-500 tabular-nums">
          Layanan Pelanggan 24/7 · E-Tiket Terverifikasi
        </p>
        <FooterLinks />
      </div>
    </footer>
  );
};
