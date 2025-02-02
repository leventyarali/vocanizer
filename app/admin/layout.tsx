"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense, useState } from "react"
import { LucideBook, LucideFileText, LucideHome, LucideMenu, LucideSettings, LucideTag, LucideUsers, LucideX, Video, LucideListTodo } from "lucide-react"
import { SidebarNav } from "@/components/admin/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { FadeIn } from "@/components/ui/animation"
import Loading from "../loading"

const menuItems = [
  {
    title: "Ana Sayfa",
    href: "/admin",
    icon: LucideHome
  },
  {
    title: "İçerik Yönetimi",
    items: [
      {
        title: "Kelimeler",
        href: "/admin/content/words",
        icon: LucideBook
      },
      {
        title: "Cümleler",
        href: "/admin/content/sentences",
        icon: LucideFileText
      },
      {
        title: "Metinler",
        href: "/admin/content/texts",
        icon: LucideFileText
      },
      {
        title: "Videolar",
        href: "/admin/content/videos",
        icon: Video
      },
      {
        title: "Etiketler",
        href: "/admin/content/tags",
        icon: LucideTag
      }
    ]
  },
  {
    title: "Kullanıcı Yönetimi",
    items: [
      {
        title: "Kullanıcılar",
        href: "/admin/users",
        icon: LucideUsers
      }
    ]
  },
  {
    title: "Sistem Yönetimi",
    items: [
      {
        title: "Görevler",
        href: "/admin/tasks/list",
        icon: LucideListTodo
      },
      {
        title: "Ayarlar",
        href: "/admin/settings",
        icon: LucideSettings
      }
    ]
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative min-h-screen">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar - Masaüstü görünümünde sabit kenar çubuğu */}
        <aside className="fixed hidden h-screen w-72 border-r bg-background lg:block">
          <div className="flex h-full flex-col">
            <SidebarNav items={menuItems} pathname={pathname} />
          </div>
        </aside>

        {/* Mobil Sidebar - Mobil görünümde üst çubuk ve açılır menü */}
        <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center border-b bg-background px-4 lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <LucideMenu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex h-16 items-center justify-between border-b px-6">
                <Link href="/admin" className="flex items-center gap-2">
                  <LucideBook className="h-6 w-6" />
                  <span className="font-semibold">Vocanizer</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <LucideX className="h-5 w-5" />
                </Button>
              </div>
              <SidebarNav items={menuItems} pathname={pathname} onItemClick={() => setIsOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <LucideBook className="h-6 w-6" />
            <span className="font-semibold">Vocanizer</span>
          </div>
        </div>

        {/* Ana İçerik Alanı */}
        <main className={cn(
          "flex-1 bg-muted/30",
          "lg:ml-72", // Masaüstü kenar boşluğu
          "mt-16 lg:mt-0" // Mobil üst boşluk
        )}>
          <div className="p-6">
            <Suspense fallback={<Loading />}>
              <FadeIn>
                {children}
              </FadeIn>
            </Suspense>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
