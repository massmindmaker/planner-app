"use client";
import { useYearStats } from "@/hooks/use-stats";
import { MonthCard } from "@/components/dashboard/month-card";
import { YearProgress } from "@/components/dashboard/year-progress";
import { GoalsSummary } from "@/components/dashboard/goals-summary";
import { EnergyPrompt } from "@/components/dashboard/energy-prompt";
import { QuarterTheme } from "@/components/dashboard/quarter-theme";
import { XpSummary } from "@/components/dashboard/xp-summary";
import { HeatmapPreview } from "@/components/dashboard/heatmap-preview";
import { AchievementShowcase } from "@/components/dashboard/achievement-showcase";
import { useCheckAchievements } from "@/hooks/use-achievements";
import { motion } from "motion/react";
import { useMemo, useEffect } from "react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function DashboardPage() {
  const { data, isLoading } = useYearStats();
  const greeting = useMemo(() => getGreeting(), []);
  const todayDate = useMemo(() => getTodayDate(), []);
  const checkAchievements = useCheckAchievements();

  useEffect(() => {
    checkAchievements.mutate();
    // Run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading)
    return (
      <div className="text-muted-foreground flex items-center justify-center h-40">
        Загрузка...
      </div>
    );

  const months = data?.months ?? [];
  const goals = data?.goals ?? { total: 0, completed: 0 };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Greeting + quote */}
      <div>
        <motion.p
          className="text-sm text-muted-foreground mb-1"
          variants={fadeInLeft}
        >
          {greeting} ☀️
        </motion.p>
        <motion.h1
          className="text-2xl font-bold"
          variants={fadeInLeft}
        >
          Обзор
        </motion.h1>
        <motion.p
          className="text-muted-foreground mt-1"
          variants={fadeInUp}
        >
          «Либо ты пишешь свой план сам, либо кто-то другой использует тебя в своём.»
        </motion.p>
      </div>

      {/* 2. Energy prompt (hidden if already logged today) */}
      <motion.div variants={fadeInUp}>
        <EnergyPrompt date={todayDate} />
      </motion.div>

      {/* 3. Quarter theme banner */}
      <motion.div variants={fadeInUp}>
        <QuarterTheme />
      </motion.div>

      {/* 4. Year progress */}
      <motion.div variants={fadeInUp}>
        <YearProgress months={months} />
      </motion.div>

      {/* 5. XP summary + Goals summary (side by side) */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <XpSummary />
        <GoalsSummary total={goals.total} completed={goals.completed} />
      </motion.div>

      {/* 6. Achievement showcase */}
      <motion.div variants={fadeInUp}>
        <AchievementShowcase />
      </motion.div>

      {/* 7. Heatmap preview */}
      <motion.div variants={fadeInUp}>
        <HeatmapPreview />
      </motion.div>

      {/* 8. Month cards grid */}
      <div>
        <motion.h2
          className="text-lg font-semibold mb-3"
          variants={fadeInUp}
        >
          Месяцы
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {months.map((m: any) => (
            <motion.div key={m.month} variants={gridItemVariants}>
              <MonthCard
                month={m.month}
                progress={m.progress}
                totalHabits={m.totalHabits}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
