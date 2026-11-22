import bgIMG from "@/assets/backgrounds/bg-hero.png";
import Alerts from "@/components/Alerts";
import AuthModal from "@/components/AuthModal";
import { Navbar } from "@/components/Navbar";
import { AuthSchema } from "@/features/auth/schema/authSchemas";
import { FeaturesCard } from "@/home/components/FeaturesCard";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FaBolt, FaCheck, FaLock } from "react-icons/fa";
import { useMatchData } from "../../matches/hooks/useMatchData";

const HomePage = () => {
  const [authType, setAuthType] = useState<"login" | "signup">("login");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "info" | "danger" | "success" | "warning" | "dark";
    message: string;
  } | null>(null);
  const { matches } = useMatchData();

  useEffect(() => {
    // 1. Cek sesi saat pertama kali render
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // 2. Update state kalau auth berubah (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleCTAClick = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setAuthType("login");
      setIsAuthOpen(true);
      return;
    }
  };

  const handleFormSubmit = async (values: AuthSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const { error } =
      authType === "login"
        ? await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          })
        : await supabase.auth.signUp({
            email: values.email,
            password: values.password,
          });

    if (error) {
      const errorMessage = error.message;
      if (errorMessage.includes("Invalid login credentials")) {
        setAlert({ variant: "danger", message: "Email atau password salah." });
      } else if (errorMessage.includes("User already registered")) {
        setAlert({ variant: "warning", message: "Email ini sudah terdaftar." });
      } else {
        setAlert({
          variant: "dark",
          message: "Terjadi kesalahan, silakan coba lagi.",
        });
      }
      return;
    }

    setAlert({ variant: "success", message: "Login berhasil!" });
  };

  const handleLoginClick = () => {
    setAuthType("login");
    setIsAuthOpen(true);
  };

  const handleSignupClick = () => {
    setAuthType("signup");
    setIsAuthOpen(true);
  };

  const toggleAuthType = () => {
    setAuthType((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <main>
      {alert && (
        <Alerts
          variant={alert.variant}
          desc={alert.message}
          duration={4000}
          onClose={() => setAlert(null)}
        />
      )}
      <header className="fixed z-40 translate-1/2 right-1/2">
        <Navbar
          handleLogin={handleLoginClick}
          handleSignup={handleSignupClick}
          user={isLoggedIn}
        />
      </header>
      <section className="relative">
        <div
          className="absolute bg-cover bg-no-repeat inset-0 z-0 h-full"
          style={{ backgroundImage: `url(${bgIMG})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 to-transparent h-full" />
        <div className="relative z-3">
          <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="max-w-xl mt-11 mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:mx-auto">
                Nonton Langsung di Stadion Kini Jadi Lebih Mudah
              </h2>
              <p className="text-base text-white/80 md:text-lg">
                Lewat tiket.ku, beli tiket pertandingan sepak bola cukup <br />
                lewat ponselmu—cepat, aman, dan tanpa antre.
              </p>
            </div>
            <div className="flex items-center sm:justify-center">
              <button
                onClick={() => handleCTAClick()}
                type="submit"
                className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
              >
                Get started
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-3 px-4 sm:px-0">
          <div className="relative grid mx-auto overflow-hidden bg-white divide-y rounded shadow sm:divide-y-0 sm:divide-x max-w-3xl sm:grid-cols-3">
            <FeaturesCard
              icon={<FaBolt className="w-6 h-6 text-purple-600" />}
              label="Cepat & Mudah"
            />
            <FeaturesCard
              icon={<FaLock className="w-6 h-6 text-purple-600" />}
              label="Aman & Resmi"
            />
            <FeaturesCard
              icon={<FaCheck className="w-6 h-6 text-purple-600" />}
              label="Jadwal Terbaru"
            />
          </div>
        </div>
      </section>
      <AuthModal
        authType={authType}
        isAuthModalOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        handleFormSubmit={handleFormSubmit}
        changeAuthType={() => toggleAuthType()}
      />
    </main>
  );
};

export default HomePage;
