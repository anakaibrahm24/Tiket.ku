import Alerts from "@/components/Alerts";
import AuthModal from "@/components/AuthModal";

import { CTABanner } from "@/components/CTABanner";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { SchedulePreview } from "@/components/SchedulePreview";
import { AuthSchema } from "@/features/auth/schema/authSchemas";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<"login" | "signup">("login");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "info" | "danger" | "success" | "warning" | "dark";
    message: string;
  } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleFormSubmit = async (values: AuthSchema) => {
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
    setIsAuthOpen(false);
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

  const handlePesanTiket = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setAuthType("login");
      setIsAuthOpen(true);
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
      {alert && (
        <Alerts
          variant={alert.variant}
          desc={alert.message}
          duration={4000}
          onClose={() => setAlert(null)}
        />
      )}
      <Navbar
        handleLogin={handleLoginClick}
        handleSignup={handleSignupClick}
        user={isLoggedIn}
      />
      <Hero onPesanTiket={handlePesanTiket} onLihatJadwal={handleLihatJadwal} />
      <Features />
      <SchedulePreview onDetail={handleLihatJadwal} />
      <CTABanner onAction={handlePesanTiket} />
      <Footer />
      <AuthModal
        authType={authType}
        isAuthModalOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        handleFormSubmit={handleFormSubmit}
        changeAuthType={toggleAuthType}
      />
    </main>
  );
};

export default HomePage;
