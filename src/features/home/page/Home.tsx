import { Button } from "@/components/Button";
import { CardAction } from "@/components/CardAction";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "react-router-dom";

const events = [
  {
    category: "Kategori",
    status: "Status",
    date: "Tanggal & Waktu",
    title: "Judul Acara",
    location: "Lokasi",
    price: "Rp ---",
  },
  {
    category: "Kategori",
    status: "Status",
    date: "Tanggal & Waktu",
    title: "Judul Acara",
    location: "Lokasi",
    price: "Rp ---",
  },
  {
    category: "Kategori",
    status: "Status",
    date: "Tanggal & Waktu",
    title: "Judul Acara",
    location: "Lokasi",
    price: "Rp ---",
  },
];

const venues = [
  { capacity: "Kapasitas 77.000", name: "Stadion Utama GBK", desc: "Laga timnas, Liga 1, dan konser stadion akbar." },
  { capacity: "Kapasitas 7.166", name: "Istora Senayan", desc: "Turnamen bulu tangkis, basket, dan konser indoor." },
  { capacity: "Kapasitas 3.700", name: "Tennis Indoor GBK", desc: "Konser intim, pertunjukan komedi, dan esports." },
  { capacity: "Area Terbuka", name: "Plaza Timur GBK", desc: "Festival musik akhir pekan dan acara komunitas." },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSession();

  const handlePesanTiket = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate("/matchs");
  };

  const handleLihatJadwal = () => {
    navigate("/matchs");
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-surface-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-surface-white"
      >
        Lewati ke konten utama
      </a>
      <Navbar user={isLoggedIn} />
      <div id="main-content">
        <section className="relative overflow-hidden border-b border-dark-700 bg-night-950">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-surface-subtle opacity-40"
          >
            <span className="material-symbols-outlined text-6xl text-ink-300">
              image
            </span>
          </div>
          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-12 lg:px-16 lg:py-20">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-blue px-3.5 py-1.5 text-surface-white">
                <span className="material-symbols-outlined text-label-lg" aria-hidden="true">
                  verified
                </span>
                <span className="font-label text-label-md">Mitra Resmi Tiket Kawasan GBK</span>
              </div>

              <h1 className="font-display text-display-lg-mobile text-balance text-surface-white lg:text-display-lg">
                Pesan tiket resmi acara Stadion GBK tanpa antre.
              </h1>

              <p className="max-w-prose font-body text-body-lg text-brand-sky text-pretty">
                Satu pintu untuk laga timnas, pertandingan Liga 1, konser musik akbar, dan turnamen
                internasional di Gelora Bung Karno dengan e-tiket QR instan.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Button
                  type="button"
                  label="Jelajahi Jadwal GBK"
                  variant="primary"
                  icon={
                    <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                      arrow_forward
                    </span>
                  }
                  onClick={() => scrollTo("jadwal-gbk")}
                />
                <Button
                  type="button"
                  label="Lihat Venue GBK"
                  variant="glass"
                  onClick={() => scrollTo("venue-gbk")}
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <article className="overflow-hidden rounded-xl border border-line-on-dark bg-dark-900 shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden">
                <div
                  aria-hidden="true"
                  className="flex h-full w-full items-center justify-center bg-surface-subtle"
                >
                  <span className="material-symbols-outlined text-5xl text-ink-300">
                    image
                  </span>
                </div>
                  <span className="absolute left-3 top-3 rounded-full bg-brand-blue px-3 py-1 font-label text-label-md text-surface-white">
                    Sorotan Utama
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-surface-muted px-3 py-1 font-label text-label-md text-ink-700">
                    Status
                  </span>
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <p className="font-label text-label-md tabular-nums text-brand-sky">Tanggal & Waktu</p>
                  <h2 className="font-title text-headline-md text-surface-white">Judul Acara</h2>
                  <p className="flex items-center gap-1.5 font-body text-body-md text-brand-sky">
                    <span className="material-symbols-outlined text-body-lg" aria-hidden="true">
                      location_on
                    </span>
                    <span>Lokasi</span>
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-4 border-t border-line-on-dark pt-3">
                    <div className="flex flex-col">
                      <span className="font-label text-label-md text-brand-sky">Mulai dari</span>
                      <span className="font-mono text-mono-md tabular-nums text-surface-white">Rp ---</span>
                    </div>
                    <Button type="button" label="Pilih Kursi" variant="primary" onClick={handleLihatJadwal} />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="jadwal-gbk" className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 lg:px-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <span className="font-label text-label-md text-brand-deep">Agenda Terdekat</span>
              <h2 className="font-headline text-headline-lg-mobile text-balance text-ink-900 lg:text-headline-lg">
                Acara pilihan di Kawasan GBK
              </h2>
            </div>
            <button
              type="button"
              onClick={() => scrollTo("venue-gbk")}
              className="inline-flex items-center gap-1.5 font-label text-label-lg text-brand-deep transition-colors hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              aria-label="Lihat semua venue"
            >
              Lihat Semua Venue
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
            {events.map((event) => (
              <CardAction
                key={event.title}
                media={
                  <div
                    aria-hidden="true"
                    className="flex h-full w-full items-center justify-center bg-surface-subtle"
                  >
                    <span className="material-symbols-outlined text-4xl text-ink-300">
                      image
                    </span>
                  </div>
                }
                category={event.category}
                status={event.status}
                date={event.date}
                title={event.title}
                location={event.location}
                price={event.price}
                actionLabel="Pilih Tiket"
                onAction={handleLihatJadwal}
              />
            ))}
          </div>
        </section>

        <section id="keunggulan" className="border-y border-line-soft bg-surface-subtle">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 lg:px-16">
            <div className="max-w-2xl flex flex-col gap-2">
              <span className="font-label text-label-md text-brand-deep">Kenapa Tiket.ku</span>
              <h2 className="font-headline text-headline-lg-mobile text-balance text-ink-900 lg:text-headline-lg">
                Pengalaman masuk stadion yang rapi dan pasti.
              </h2>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
              {[
                {
                  icon: "qr_code_scanner",
                  title: "E-Tiket QR Pintu Resmi",
                  desc: "Pindai langsung di gerbang elektronik GBK tanpa perlu menukar tiket fisik di loket stadion.",
                },
                {
                  icon: "event_seat",
                  title: "Pilihan Zona Tribun Jelas",
                  desc: "Bandingkan ketersediaan kursi dari Tribun Utara, Timur, hingga VIP Barat secara real-time.",
                },
                {
                  icon: "verified_user",
                  title: "Transaksi Aman & Instan",
                  desc: "Bayar lewat QRIS, transfer bank, atau kartu debit dengan konfirmasi e-tiket instan.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col gap-3 rounded-xl border border-line-soft bg-surface-white p-6"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-tint text-brand-deep">
                    <span className="material-symbols-outlined text-headline-md" aria-hidden="true">
                      {feature.icon}
                    </span>
                  </span>
                  <h3 className="font-title text-title-lg text-ink-900">{feature.title}</h3>
                  <p className="font-body text-body-md text-ink-600 text-pretty">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="venue-gbk" className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 lg:px-16">
          <div className="flex flex-col gap-2">
            <span className="font-label text-label-md text-brand-deep">Kawasan Senayan</span>
            <h2 className="font-headline text-headline-lg-mobile text-balance text-ink-900 lg:text-headline-lg">
              Empat venue utama yang kami layani
            </h2>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {venues.map((venue) => (
              <div
                key={venue.name}
                className="flex flex-col justify-between gap-4 rounded-xl border border-line-soft bg-surface-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="font-label text-label-md tabular-nums text-brand-deep">
                    {venue.capacity}
                  </span>
                  <h3 className="font-title text-title-md text-ink-900">{venue.name}</h3>
                  <p className="font-body text-body-md text-ink-600 text-pretty">{venue.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="cta-gbk" className="mx-auto max-w-7xl px-6 pb-14 lg:px-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-line-on-dark bg-night-950 p-8 lg:flex-row lg:items-center lg:p-12">
            <div className="max-w-xl flex flex-col gap-2">
              <h2 className="font-headline text-headline-lg-mobile text-balance text-surface-white lg:text-headline-lg">
                Siap mengamankan kursi Anda di GBK?
              </h2>
              <p className="font-body text-body-lg text-brand-sky text-pretty">
                Buka katalog jadwal lengkap dan pilih kategori tribun yang sesuai sebelum kuota habis.
              </p>
            </div>
            <Button
              type="button"
              label="Beli Tiket Sekarang"
              variant="primary"
              icon={
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                  confirmation_number
                </span>
              }
              onClick={handlePesanTiket}
            />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default HomePage;
