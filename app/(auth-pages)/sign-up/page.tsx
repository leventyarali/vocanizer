'use client'

import { signUpAction } from "@/app/actions";
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

export default function SignUp() {
  const handleGoogleSignIn = async () => {
    try {
      const supabase = createClient();
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
        console.error('Google OAuth Error:', error);
        toast.error('Google ile giriş yapılırken bir hata oluştu');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Google OAuth Error:', error);
      toast.error('Google ile giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center w-full p-4">
      <div className="w-full max-w-md space-y-8">
        <ScaleIn>
          <form className="flex flex-col w-full gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Hesap Oluşturun
              </h1>
              <p className="text-sm text-muted-foreground">
                Zaten hesabınız var mı?{" "}
                <Link className="text-primary font-medium hover:underline" href="/sign-in">
                  Giriş Yapın
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
                  Google ile Kayıt Ol
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
              <Label htmlFor="password">Şifre</Label>
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
              pendingText="Hesap oluşturuluyor..."
              formAction={signUpAction}
            >
              Kayıt Ol
            </SubmitButton>

            <FormMessage />
          </form>
        </ScaleIn>
      </div>
    </div>
  );
}
