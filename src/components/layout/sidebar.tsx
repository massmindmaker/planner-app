"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, MONTH_NAMES } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  Calendar,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { href: "/", label: "Обзор", icon: LayoutDashboard },
  { href: "/goals", label: "Цели на год", icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span>&#8734;</span>
          <span>Планер</span>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                pathname === item.href && "bg-accent font-medium"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Месяцы
            </p>
          </div>

          {MONTH_NAMES.map((name, i) => {
            const href = `/month/${i + 1}`;
            const isActive = pathname === href;
            const isCurrent = i + 1 === new Date().getMonth() + 1;
            return (
              <Link
                key={i}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                  isActive && "bg-accent font-medium",
                  isCurrent && !isActive && "text-primary font-medium"
                )}
              >
                <Calendar className="h-3.5 w-3.5" />
                {name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
