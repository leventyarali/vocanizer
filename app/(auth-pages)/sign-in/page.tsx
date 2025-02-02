'use client'

import { signInAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { ScaleIn } from "@/components/ui/animation";
import { toast } from "sonner";

export default function SignIn() {
  const handleGoogleSignIn = async () => {
    try {
      const supabase = createClient();

      // Debug: Supabase URL ve anon key kontrolü
      console.log('Supabase Config:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile openid',
        },
      });

      if (error) {
        console.error('Google OAuth Error Details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        toast.error(`Google ile giriş yapılırken bir hata oluştu: ${error.message}`);
        return;
      }

      if (!data?.url) {
        console.error('No redirect URL provided by Supabase');
        toast.error('Yönlendirme URL\'si alınamadı');
        return;
      }

      // Debug: Yönlendirme URL'sini göster
      console.log('OAuth Flow:', {
        redirectUrl: data.url,
        currentOrigin: window.location.origin
      });
      
      window.location.href = data.url;
    } catch (error) {
      console.error('Unexpected Google OAuth Error:', error);
      toast.error('Google ile giriş yapılırken beklenmeyen bir hata oluştu');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center w-full p-4">
      <div className="w-full max-w-md space-y-8">
        <ScaleIn>
          <form className="flex flex-col w-full gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Hesabınıza Giriş Yapın
              </h1>
              <p className="text-sm text-muted-foreground">
                Hesabınız yok mu?{" "}
                <Link className="text-primary font-medium hover:underline" href="/sign-up">
                  Kayıt Olun
                </Link>
              </p>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full relative overflow-hidden group"
              onClick={handleGoogleSignIn}
              size="lg"
            >
              <div className="absolute inset-0 w-3 bg-primary transition-all duration-[250ms] ease-out group-hover:w-full" />
              <div className="relative flex items-center justify-center gap-2">
                <FcGoogle className="h-5 w-5" />
                <span className="group-hover:text-background transition-colors duration-200">
                  Google ile Giriş Yap
                </span>
              </div>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Veya devam et
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ornek@email.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Şifre</Label>
                <Link
                  className="text-sm text-primary hover:underline"
                  href="/forgot-password"
                >
                  Şifremi Unuttum
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <SubmitButton
              className="w-full"
              size="lg"
              pendingText="Giriş yapılıyor..."
              formAction={signInAction}
            >
              Giriş Yap
            </SubmitButton>

            <FormMessage />
          </form>
        </ScaleIn>
      </div>
    </div>
  );
}
