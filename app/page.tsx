'use client'

import { Suspense } from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Globe, Settings, Sparkles, LogIn, UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/ui/animation";
import Loading from './loading'
import { useUser } from "@/hooks/use-user";

const features = [
  {
    icon: Brain,
    title: "Adaptif Öğrenme",
    description: "Kişisel öğrenme hızınıza ve seviyenize göre uyarlanmış içerik",
  },
  {
    icon: Sparkles,
    title: "Akıllı Tekrar",
    description: "Unutma eğrisine göre optimize edilmiş tekrar sistemi",
  },
  {
    icon: Globe,
    title: "Çoklu Dil Desteği",
    description: "Birden fazla dili aynı anda öğrenme imkanı",
  },
];

export default function Home() {
  const { user, isAdmin, loading } = useUser();

  return (
    <Suspense fallback={<Loading />}>
      <div className="relative min-h-screen">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3 py-16">
            <main className="flex-1 flex flex-col gap-6 text-center">
              <ScaleIn delay={0.2}>
                <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Vocanizer
                </h1>
              </ScaleIn>
              
              <FadeIn delay={0.4}>
                <p className="text-2xl text-muted-foreground">
                  Kelime öğrenmeyi daha eğlenceli ve etkili hale getirin.
                </p>
              </FadeIn>

              <FadeIn delay={0.6} className="py-4">
                <Link href="/sign-up">
                  <Button size="lg" className="gap-2">
                    Hemen Başla
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </FadeIn>

              <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

              <StaggerContainer className="gap-8 text-foreground" delayChildren={0.8}>
                <StaggerItem>
                  <h2 className="text-lg font-bold">Özellikler</h2>
                </StaggerItem>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, i) => (
                    <StaggerItem key={i}>
                      <div className="flex flex-col gap-2 p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent/50">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </main>
          </div>

          <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
            <p className="text-muted-foreground">
              Powered by{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                className="font-medium hover:underline"
                rel="noreferrer"
              >
                Supabase
              </a>
            </p>
          </footer>
        </div>
      </div>
    </Suspense>
  )
}
