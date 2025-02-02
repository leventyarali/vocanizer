"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideSettings } from "lucide-react";
import { Users, ListTodo } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { signOutAction } from "@/app/actions";
import { FadeIn, SlideIn } from "@/components/ui/animation";
import { motion } from "framer-motion";

interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  items?: NavItem[];
}

interface SidebarNavProps {
  items: NavItem[];
  pathname: string;
  onItemClick?: () => void;
}

export function SidebarNav({ items, pathname, onItemClick }: SidebarNavProps) {
  const { user } = useAuth();

  return (
    <>
      <nav className="flex-1 space-y-4 p-4">
        {items.map((item, index) => {
          if (item.items) {
            return (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="space-y-1">
                  <h2 className="px-2 text-sm font-semibold tracking-tight text-muted-foreground">
                    {item.title}
                  </h2>
                  <div className="space-y-1">
                    {item.items.map((subItem, subIndex) => (
                      <SlideIn key={subItem.href} delay={subIndex * 0.05}>
                        <Link
                          href={subItem.href || "#"}
                          onClick={onItemClick}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                            pathname === subItem.href
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-primary/5"
                          )}
                        >
                          {subItem.icon && <subItem.icon className="h-4 w-4" />}
                          {subItem.title}
                        </Link>
                      </SlideIn>
                    ))}
                  </div>
                </div>
              </FadeIn>
            );
          }

          return (
            <SlideIn key={item.href} delay={index * 0.1}>
              <Link
                href={item.href || "#"}
                onClick={onItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                  pathname === item.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-primary/5"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.title}
              </Link>
            </SlideIn>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.email?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">
                    {user?.email?.split('@')[0] || 'Admin'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email || 'admin@vocanizer.com'}
                  </span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="flex items-center">
                <LucideSettings className="mr-2 h-4 w-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-destructive">
              <form action={signOutAction}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-destructive">
                  Çıkış Yap
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
} 