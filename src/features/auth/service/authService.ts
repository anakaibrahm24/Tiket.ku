import type { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export const getSession = () => supabase.auth.getSession();

export const onAuthStateChange = (
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0],
) => supabase.auth.onAuthStateChange(callback);

export const requireUserId = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Silakan masuk untuk memesan tiket.");
  }
  return data.user.id;
};

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
  const lowerMessage = message.toLowerCase();
  if (message.includes("Invalid login credentials")) {
    return "Email atau password salah.";
  }
  if (message.includes("User already registered")) {
    return "Email ini sudah terdaftar.";
  }
  if (message.includes("Email not confirmed")) {
    return "Email belum diverifikasi. Cek inbox Anda.";
  }
  if (lowerMessage.includes("weak password")) {
    return "Kata sandi terlalu lemah.";
  }
  if (lowerMessage.includes("oauth")) {
    return "Gagal masuk dengan Google. Coba lagi.";
  }
  if (lowerMessage.includes("network") || lowerMessage.includes("fetch")) {
    return "Koneksi ke server gagal. Coba lagi.";
  }
  return "Terjadi kesalahan, silakan coba lagi.";
};