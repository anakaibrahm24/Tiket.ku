import { CTABanner } from "@/components/CTABanner";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { SchedulePreview } from "@/components/SchedulePreview";
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "react-router-dom";

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

  return (
    <main className="min-h-screen bg-surface-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-surface-white">
        Lewati ke konten utama
      </a>
      <Navbar user={isLoggedIn} />
      <Hero onPesanTiket={handlePesanTiket} onLihatJadwal={handleLihatJadwal} />
      <Features />
      <SchedulePreview onDetail={handleLihatJadwal} />
      <CTABanner onAction={handlePesanTiket} />
      <Footer />
    </main>
  );
};

export default HomePage;