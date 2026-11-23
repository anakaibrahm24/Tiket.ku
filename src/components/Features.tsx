import { FaCalendarAlt, FaTicketAlt, FaShieldAlt, FaQrcode } from "react-icons/fa";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: <FaCalendarAlt />,
    title: "Jadwal Lengkap",
    description: "Lihat semua acara sepak bola dan konser di GBK dalam satu tempat.",
  },
  {
    icon: <FaTicketAlt />,
    title: "Pilih Tribun",
    description: "Pilih tribun dan jumlah tiket sesuai kebutuhan dengan harga transparan.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Pembayaran Aman",
    description: "Proses pembayaran simulasi yang cepat dan tercatat dengan jelas.",
  },
  {
    icon: <FaQrcode />,
    title: "E-Ticket QR",
    description: "Terima tiket digital dengan QR code, siap dicetak atau ditunjukkan.",
  },
];

export const Features = () => {
  return (
    <section className="bg-surface-subtle py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-ink-900">
            Semua yang Kamu Butuhkan untuk Nonton Langsung
          </h2>
          <p className="mt-2 text-base text-ink-600">
            Dari jadwal acara hingga e-ticket digital, semuanya dalam satu platform.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};