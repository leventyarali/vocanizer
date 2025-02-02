"use server";

import { createClient } from "@/lib/supabase/server";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
  const origin = (await headers()).get("origin");
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();

  if (!email || !password) {
    return redirect("/sign-up?error=E-posta ve şifre gereklidir");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/sign-up?error=" + error.message);
  }

  return redirect("/sign-up?success=Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.");
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/sign-in?error=" + error.message);
  }

  // Admin kontrolü
  if (data.user.email === 'leventyarali@gmail.com') {
    return redirect("/admin");
  }

  return redirect("/");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return redirect("/forgot-password?error=E-posta adresi gereklidir");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    return redirect("/forgot-password?error=Şifre sıfırlama başarısız");
  }

  return redirect("/forgot-password?success=Şifre sıfırlama bağlantısı e-posta adresinize gönderildi");
}

export async function resetPasswordAction(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return redirect("/protected/reset-password?error=Şifre ve şifre tekrarı gereklidir");
  }

  if (password !== confirmPassword) {
    return redirect("/protected/reset-password?error=Şifreler eşleşmiyor");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return redirect("/protected/reset-password?error=Şifre güncelleme başarısız");
  }

  return redirect("/protected/reset-password?success=Şifre başarıyla güncellendi");
}

export async function signOutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({
    scope: 'global'
  });

  if (error) {
    console.error('Çıkış yapma hatası:', error);
    return redirect("/sign-in?error=" + error.message);
  }

  return redirect("/sign-in");
}
