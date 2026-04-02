"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn, MONTH_NAMES } from "@/lib/utils";
import {
  LayoutDashboard,
  Compass,
  Target,
  Repeat,
  PieChart,
  BarChart3,
  Trophy,
  Calendar,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
import { useXp } from "@/hooks/use-xp";
import { getLevel } from "@/lib/xp";
import { getISOWeek } from "date-fns";
import { useYear } from "@/contexts/year-context";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { href: "/", label: "Обзор", icon: LayoutDashboard },
  { href: "/life", label: "Миссия", icon: Compass },
  { href: "/goals", label: "Цели на год", icon: Target },
  { href: "/routines", label: "Рутины", icon: Repeat },
  { href: "/wheel", label: "Колесо жизни", icon: PieChart },
  { href: "/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/achievements", label: "Достижения", icon: Trophy },
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

function YearSwitcher() {
  const { year, setYear } = useYear();
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="border-t border-sidebar-border px-4 py-2">
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className={cn(
          "w-full rounded-md border border-sidebar-border bg-background px-2 py-1.5",
          "text-xs font-medium text-sidebar-foreground",
          "focus:outline-none focus:ring-1 focus:ring-primary",
          "cursor-pointer transition-colors hover:bg-sidebar-accent"
        )}
        aria-label="Выбрать год"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y === currentYear ? `${y} (текущий)` : String(y)}
          </option>
        ))}
      </select>
    </div>
  );
}

function XpBar() {
  const { data } = useXp();

  if (!data) return null;

  const levelInfo = getLevel(data.totalXp ?? 0);
  const progress =
    levelInfo.xpForLevel > 0
      ? Math.min(100, Math.round((levelInfo.xpInLevel / levelInfo.xpForLevel) * 100))
      : 100;

  return (
    <div className="border-t border-sidebar-border px-4 py-3 space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-sidebar-foreground">
          Уровень {levelInfo.level} — {levelInfo.title}
        </span>
        <span className="text-muted-foreground">{progress}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {levelInfo.nextLevel && (
        <p className="text-[10px] text-muted-foreground">
          {levelInfo.xpToNext} XP до «{levelInfo.nextLevel.title}»
        </p>
      )}
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [monthsExpanded, setMonthsExpanded] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const now = new Date();
  const currentWeek = getISOWeek(now);
  const currentYear = now.getFullYear();
  const weekHref = `/week/${currentYear}-W${String(currentWeek).padStart(2, "0")}`;

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4 shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg"
          onClick={onNavigate}
        >
          <span className="text-gradient text-2xl">&#8734;</span>
          <span className="text-gradient">Планер</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground"
          aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-4">
          {/* Nav Items */}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.href} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
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

          {/* Current Week Link */}
          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
            <Link
              href={weekHref}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                pathname === weekHref
                  ? "bg-sidebar-accent font-medium text-sidebar-primary"
                  : "text-sidebar-foreground"
              )}
            >
              {pathname === weekHref && (
                <motion.div
                  layoutId="nav-active-border"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full bg-primary"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              )}
              <Calendar className="h-4 w-4" />
              Текущая неделя
            </Link>
          </motion.div>

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
                        onClick={onNavigate}
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

      {/* Year Switcher + XP Bar Footer */}
      <YearSwitcher />
      <XpBar />
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarStyle = {
    background: theme === "dark" ? "rgba(24,20,36,0.85)" : "rgba(255,255,255,0.7)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  };

  return (
    <>
      {/* Desktop sidebar — fixed, always visible on lg+ */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border flex-col"
        style={sidebarStyle}
      >
        <SidebarContent />
      </aside>

      {/* Mobile: burger button */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border bg-background/80 backdrop-blur-sm shadow-sm transition-colors hover:bg-accent"
        onClick={() => setMobileOpen(true)}
        aria-label="Открыть меню"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile: overlay + sliding sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="lg:hidden fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Sliding sidebar panel */}
            <motion.aside
              key="mobile-sidebar"
              className="lg:hidden fixed left-0 top-0 z-50 h-screen w-64 border-r border-sidebar-border flex flex-col"
              style={sidebarStyle}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Close button */}
              <button
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Закрыть меню"
              >
                <X className="h-4 w-4" />
              </button>

              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
