import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Alerts from "@/components/Alerts";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { useSession } from "@/hooks/useSession";
import {
  loginSchema,
  type LoginSchema,
} from "@/features/auth/schema/authSchemas";
import {
  mapAuthError,
  signInWithEmail,
  signInWithGoogle,
} from "@/features/auth/service/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/matchs";
  const { isLoggedIn, isLoading } = useSession();
  const [alert, setAlert] = useState<{
    variant: "info" | "danger" | "success" | "warning" | "dark";
    message: string;
  } | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoading, isLoggedIn, navigate, from]);

  const onSubmit = async (values: LoginSchema) => {
    const { error } = await signInWithEmail(values.email, values.password);
    if (error) {
      setAlert({
        variant: "danger",
        message: mapAuthError(error) ?? "Terjadi kesalahan, silakan coba lagi.",
      });
      return;
    }
    navigate(from);
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setAlert({
        variant: "danger",
        message: mapAuthError(error) ?? "Gagal masuk dengan Google. Coba lagi.",
      });
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
          aria-label="Kembali">
          ←
        </button>
        <div className="w-full max-w-[440px] rounded-lg border border-line-soft bg-surface-white p-8 shadow-md">
          <h1 className="text-center text-2xl font-semibold text-ink-900">
            Masuk
          </h1>
          <p className="mt-2 text-center text-sm text-ink-600 text-pretty">
            Selamat datang kembali. Masukkan email dan kata sandi Anda.
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={isSubmitting || isGoogleLoading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-line-soft bg-surface-white px-6 py-3.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            {isGoogleLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink-300 border-t-brand-blue" />
            ) : (
              <FcGoogle size={20} />
            )}
            {isGoogleLoading ? "Memproses..." : "Masuk dengan Google"}
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-line-soft" />
            <span className="text-xs text-ink-500">atau</span>
            <div className="h-px flex-1 bg-line-soft" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-ink-900">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
                disabled={isSubmitting || isGoogleLoading}
                className="h-11 w-full rounded-lg border border-line-soft bg-surface-white px-3.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-500 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="nama@email.com"
              />
              {errors.email?.message && (
                <p id="email-error" className="text-xs text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-ink-900">
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
                disabled={isSubmitting || isGoogleLoading}
                className="h-11 w-full rounded-lg border border-line-soft bg-surface-white px-3.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-500 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Masukkan kata sandi"
              />
              {errors.password?.message && (
                <p id="password-error" className="text-xs text-danger">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              label="Masuk"
              disabled={isSubmitting || isGoogleLoading}
              className="w-full rounded-lg bg-brand-blue px-6 py-3.5 text-sm font-semibold text-surface-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
            />

            <p className="text-center text-sm text-ink-600">
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-semibold text-brand-blue hover:underline">
                Daftar sekarang
              </button>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default LoginPage;
