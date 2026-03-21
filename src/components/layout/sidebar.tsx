"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, MONTH_NAMES } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { href: "/", label: "Обзор", icon: LayoutDashboard },
  { href: "/goals", label: "Цели на год", icon: Target },
];

function MonthDot({ monthIndex }: { monthIndex: number }) {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed

  let color: string;
  if (monthIndex < currentMonth) {
    color = "bg-emerald-500";
  } else if (monthIndex === currentMonth) {
    color = "bg-blue-500 animate-pulse";
  } else {
    color = "bg-gray-300 dark:bg-gray-600";
  }

  return (
    <span
      className={cn(
        "inline-block h-2 w-2 shrink-0 rounded-full transition-colors duration-300",
        color
      )}
    />
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [monthsExpanded, setMonthsExpanded] = useState(true);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-gradient text-2xl">&#8734;</span>
          <span className="text-gradient">Планер</span>
        </Link>
      </div>

      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <nav className="space-y-1 p-4">
          {/* Nav Items */}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.href} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-accent font-medium text-sidebar-primary"
                      : "text-sidebar-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-border"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-primary"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  )}
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </motion.div>
            );
          })}

          {/* Months Header */}
          <div className="pt-4 pb-2">
            <button
              onClick={() => setMonthsExpanded(!monthsExpanded)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-1",
                "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                "hover:text-foreground transition-colors duration-200"
              )}
            >
              <span>Месяцы</span>
              <motion.div
                animate={{ rotate: monthsExpanded ? 0 : -90 }}
                transition={{ duration: 0.25 }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.div>
            </button>
          </div>

          {/* Month Links */}
          <AnimatePresence initial={false}>
            {monthsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                {MONTH_NAMES.map((name, i) => {
                  const href = `/month/${i + 1}`;
                  const isActive = pathname === href;
                  const isCurrent = i === new Date().getMonth();

                  return (
                    <motion.div
                      key={i}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={href}
                        className={cn(
                          "relative flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all duration-200",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive
                            ? "bg-sidebar-accent font-medium text-sidebar-primary"
                            : isCurrent
                              ? "text-sidebar-primary font-medium"
                              : "text-sidebar-foreground"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="month-active-border"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-primary"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                          />
                        )}
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="flex-1">{name}</span>
                        <MonthDot monthIndex={i} />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </ScrollArea>
    </aside>
  );
}
