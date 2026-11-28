import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Alerts from "@/components/Alerts";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { InputField } from "@/components/InputField";
import { useSession } from "@/hooks/useSession";
import {
  signupSchema,
  type SignupSchema,
} from "@/features/auth/schema/authSchemas";
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
      values.phone,
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
    <main className="min-h-screen bg-light-surface flex flex-col items-center justify-center px-6 py-12">
      {alert && (
        <Alerts
          variant={alert.variant}
          desc={alert.message}
          duration={4000}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 text-light-on-surface">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue text-light-on-primary">
              <span className="material-symbols-outlined text-headline-md" aria-hidden="true">
                confirmation_number
              </span>
            </span>
            <span className="font-display text-headline-md text-light-on-surface">
              Tiket.ku
            </span>
          </Link>
          <p className="font-body text-body-md text-light-on-surface-variant">
            Portal resmi pemesanan tiket Stadion Gelora Bung Karno
          </p>
        </div>

        <section className="flex flex-col gap-6 rounded-xl border border-light-outline-variant bg-light-surface-container-lowest p-8 shadow-sm">
          <header className="flex flex-col gap-1.5">
            <h1 className="font-headline text-headline-md text-light-on-surface">
              Buat akun Tiket.ku
            </h1>
            <p className="font-body text-body-md text-light-on-surface-variant">
              Daftar sekali untuk pesan tiket laga timnas, Liga 1, dan konser GBK.
            </p>
          </header>

          <Button
            type="button"
            variant="oauth"
            disabled={isSubmitting || isGoogleLoading}
            onClick={handleGoogle}
            className="gap-3"
          >
            {isGoogleLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-light-outline-variant border-t-brand-blue" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
              </svg>
            )}
            <span className="font-label text-label-lg">
              {isGoogleLoading ? "Memproses..." : "Daftar dengan Google"}
            </span>
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-light-outline-variant" />
            <span className="font-label text-label-md text-light-outline">
              atau daftar dengan email
            </span>
            <div className="h-px flex-1 bg-light-outline-variant" />
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
              id="phone"
              labelName="Nomor WhatsApp"
              type="tel"
              autoComplete="tel"
              placeholder="0812-3456-7890"
              required
              disabled={isSubmitting || isGoogleLoading}
              error={errors.phone?.message}
              {...register("phone")}
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

            <label className="inline-flex cursor-pointer select-none items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                defaultChecked
                required
                className="mt-0.5 h-4 w-4 rounded-sm border-light-outline-variant text-brand-blue focus:ring-brand-blue"
              />
              <span className="font-body text-body-md text-light-on-surface-variant">
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
          </form>

          <footer className="border-t border-light-outline-variant pt-4 text-center">
            <p className="font-body text-body-md text-light-on-surface-variant">
              Sudah punya akun Tiket.ku?{" "}
              <Link
                to="/login"
                className="ml-1 font-label text-label-lg text-brand-deep hover:text-brand-blue"
              >
                Masuk sekarang
              </Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default SignupPage;
