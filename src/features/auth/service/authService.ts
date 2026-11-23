import type { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export const getSession = () => supabase.auth.getSession();

export const onAuthStateChange = (
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0],
) => supabase.auth.onAuthStateChange(callback);

export const signInWithEmail = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signUpWithEmail = (email: string, password: string, fullName: string) =>
  supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });

export const signOut = () => supabase.auth.signOut();

export const mapAuthError = (error: AuthError | null): string | null => {
  if (!error) return null;
  const message = error.message;
  if (message.includes("Invalid login credentials")) {
    return "Email atau password salah.";
  }
  if (message.includes("User already registered")) {
    return "Email ini sudah terdaftar.";
  }
  if (message.includes("Email not confirmed")) {
    return "Email belum diverifikasi. Cek inbox Anda.";
  }
  if (message.toLowerCase().includes("oauth")) {
    return "Gagal masuk dengan Google. Coba lagi.";
  }
  return "Terjadi kesalahan, silakan coba lagi.";
};