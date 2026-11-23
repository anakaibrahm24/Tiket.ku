import { Button } from "./Button";

interface HeroProps {
  onPesanTiket: () => void;
  onLihatJadwal: () => void;
}

export const Hero = ({ onPesanTiket, onLihatJadwal }: HeroProps) => {
  return (
    <section id="main-content" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night-950">
      <div
        className="absolute inset-0 bg-gradient-to-b from-night-950 via-brand-deep to-surface-white"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium tracking-wide text-brand-sky">
            Tiket.ku — Stadion Gelora Bung Karno
          </p>
          <h1 className="font-display text-4xl font-normal leading-[1.083] tracking-[-1.5px] text-surface-white sm:text-5xl lg:text-[48px]">
            Nonton Langsung di Stadion
          </h1>
          <p className="mt-2 font-display text-3xl font-normal leading-[1.158] tracking-[-0.76px] text-brand-sky sm:text-4xl">
            Kini Jadi Lebih Mudah
          </p>
          <p className="mt-6 text-base leading-6 text-brand-sky/90 sm:text-lg">
            Beli tiket pertandingan sepak bola dan konser di Stadion GBK cepat,
            aman, dan tanpa antre lewat ponsel.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              label="Pesan Tiket"
              onClick={onPesanTiket}
              className="bg-brand-blue px-6 py-3.5 text-base font-semibold text-surface-white hover:bg-brand-hover rounded-lg"
            />
            <Button
              label="Lihat Jadwal"
              onClick={onLihatJadwal}
              className="bg-line-on-dark px-6 py-3.5 text-base font-semibold text-surface-white hover:bg-white/20 rounded-lg border border-line-on-dark"
            />
          </div>
        </div>
      </div>
    </section>
  );
};