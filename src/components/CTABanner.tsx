interface CTABannerProps {
  onAction: () => void;
}

export const CTABanner = ({ onAction }: CTABannerProps) => {
  return (
    <section className="bg-brand-blue py-14">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-semibold text-surface-white">
          Siap Nonton Langsung di GBK?
        </h2>
        <p className="mt-3 text-base text-brand-sky">
          Dapatkan tiket acara favoritmu sekarang, tanpa antre.
        </p>
        <button
          type="button"
          onClick={onAction}
          className="mt-8 rounded-lg bg-brand-blue px-7 py-3.5 text-base font-semibold text-surface-white hover:opacity-90">
          Pesan Tiket Sekarang
        </button>
      </div>
    </section>
  );
};
