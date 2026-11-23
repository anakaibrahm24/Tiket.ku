import { ScheduleCard } from "./ScheduleCard";

const events = [
  {
    badge: "Sepak Bola",
    title: "Indonesia vs Bahrain",
    subtitle: "Kualifikasi Piala Dunia",
    date: "Sab, 12 Des 2026",
    time: "20:00 WIB",
    venue: "Stadion GBK",
  },
  {
    badge: "Konser",
    title: "Konser Amal GBK",
    subtitle: "Berbagai Artis",
    date: "Sab, 19 Des 2026",
    time: "19:00 WIB",
    venue: "Stadion GBK",
  },
  {
    badge: "Sepak Bola",
    title: "Persija vs Persib",
    subtitle: "Liga 1 Indonesia",
    date: "Ming, 27 Des 2026",
    time: "16:00 WIB",
    venue: "Stadion GBK",
  },
];

interface SchedulePreviewProps {
  onDetail: () => void;
}

export const SchedulePreview = ({ onDetail }: SchedulePreviewProps) => {
  return (
    <section className="bg-surface-white py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-ink-900">
            Jadwal Acara Mendatang
          </h2>
          <p className="mt-2 text-base text-ink-600">
            Pertandingan sepak bola dan konser terbaru di Stadion GBK.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <ScheduleCard key={e.title} {...e} onDetail={onDetail} />
          ))}
        </div>
      </div>
    </section>
  );
};