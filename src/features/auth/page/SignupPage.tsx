import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Alerts from "@/components/Alerts";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { InputField } from "@/components/InputField";
import { useSession } from "@/hooks/useSession";
import { signupSchema, type SignupSchema } from "@/features/auth/schema/authSchemas";
import {
  getSession,
  mapAuthError,
  signUpWithEmail,
  signInWithGoogle,
} from "@/features/auth/service/authService";

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/matchs";
  const { isLoggedIn, isLoading } = useSession();
  const [alert, setAlert] = useState<{
    variant: "info" | "danger" | "success" | "warning" | "dark";
    message: string;
  } | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupSchema>({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoading, isLoggedIn, navigate, from]);

  const onSubmit = async (values: SignupSchema) => {
    const { error } = await signUpWithEmail(
      values.email,
      values.password,
      values.name,
    );
    if (error) {
      setAlert({
        variant: "danger",
        message: mapAuthError(error) ?? "Terjadi kesalahan, silakan coba lagi.",
      });
      return;
    }
    const { data } = await getSession();
    if (data.session) {
      navigate(from);
    } else {
      setAlert({
        variant: "success",
        message: "Cek email untuk verifikasi akun.",
      });
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    setStatusMessage("Menghubungkan ke akun Google Anda untuk pendaftaran Tiket.ku...");
    const { error } = await signInWithGoogle();
    if (error) {
      setAlert({
        variant: "danger",
        message: mapAuthError(error) ?? "Gagal daftar dengan Google. Coba lagi.",
      });
      setStatusMessage(null);
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-subtle">
      {alert && (
        <Alerts
          variant={alert.variant}
          desc={alert.message}
          duration={4000}
          onClose={() => setAlert(null)}
        />
      )}
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-night-950 via-brand-deep via-brand-blue to-surface-white px-6 py-16">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute left-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-line-on-dark bg-line-on-dark text-surface-white"
          aria-label="Kembali"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_back
          </span>
        </button>

        <div className="w-full max-w-[440px] rounded-xl border border-line-soft bg-surface-white p-8 shadow-sm">
          <header className="flex flex-col gap-1.5">
            <h1 className="font-headline text-headline-md text-ink-900">
              Buat akun Tiket.ku
            </h1>
            <p className="font-body text-body-md text-ink-600">
              Daftar sekali untuk pesan tiket laga timnas, Liga 1, dan konser GBK.
            </p>
          </header>

          <div className="mt-6">
            <Button
              type="button"
              variant="oauth"
              disabled={isSubmitting || isGoogleLoading}
              onClick={handleGoogle}
            >
              {isGoogleLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink-300 border-t-brand-blue" />
              ) : (
                <FcGoogle size={20} />
              )}
              {isGoogleLoading ? "Memproses..." : "Daftar dengan Google"}
            </Button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-line-soft" />
            <span className="font-label text-label-md text-ink-500">
              atau daftar dengan email
            </span>
            <div className="h-px flex-1 bg-line-soft" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              id="name"
              labelName="Nama Lengkap (sesuai KTP)"
              type="text"
              autoComplete="name"
              placeholder="Budi Santoso"
              required
              disabled={isSubmitting || isGoogleLoading}
              error={errors.name?.message}
              {...register("name")}
            />

            <InputField
              id="email"
              labelName="Email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              required
              disabled={isSubmitting || isGoogleLoading}
              error={errors.email?.message}
              {...register("email")}
            />

            <InputField
              id="password"
              labelName="Kata Sandi"
              type="password"
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
              required
              disabled={isSubmitting || isGoogleLoading}
              error={errors.password?.message}
              {...register("password")}
            />

            <InputField
              id="confirmPassword"
              labelName="Konfirmasi Kata Sandi"
              type="password"
              autoComplete="new-password"
              placeholder="Ulangi kata sandi"
              required
              disabled={isSubmitting || isGoogleLoading}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <label className="inline-flex cursor-pointer select-none items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded-sm border-line-soft text-brand-blue focus:ring-brand-blue"
              />
              <span className="font-body text-body-md text-ink-600">
                Saya menyetujui Syarat & Ketentuan serta verifikasi identitas
                e-tiket GBK.
              </span>
            </label>

            {statusMessage ? (
              <Banner
                title="Status"
                description={statusMessage}
                icon="check_circle"
              />
            ) : null}

            <Button
              type="submit"
              label="Buat Akun Tiket.ku"
              variant="primary"
              disabled={isSubmitting || isGoogleLoading}
              className="mt-1 w-full"
            />

            <p className="text-center font-body text-body-md text-ink-600">
              Sudah punya akun Tiket.ku?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-label text-label-lg text-brand-deep hover:text-brand-blue"
              >
                Masuk sekarang
              </button>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default SignupPage;
