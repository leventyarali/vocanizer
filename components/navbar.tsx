'use client'

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { signOutAction } from "@/app/actions"
import { BookOpen, LogIn, LogOut, UserPlus, Settings } from "lucide-react"
import Link from "next/link"
import { SlideIn } from "./ui/animation"
import { ModeToggle } from "@/components/ui/mode-toggle"

export function Navbar() {
  const { user, loading } = useAuth()
  const isAdmin = user?.email?.includes('@admin')

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <SlideIn>
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Vocanizer</span>
            </Link>
          </SlideIn>
          <ModeToggle />
        </div>

        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <SlideIn>
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <form action={signOutAction}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Çıkış Yap
                  </Button>
                </form>
              </div>
            </SlideIn>
          ) : (
            <>
              <SlideIn delay={0.1}>
                <Link href="/sign-in">
                  <Button variant="ghost" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Giriş Yap
                  </Button>
                </Link>
              </SlideIn>
              <SlideIn delay={0.2}>
                <Link href="/sign-up">
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Kayıt Ol
                  </Button>
                </Link>
              </SlideIn>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 