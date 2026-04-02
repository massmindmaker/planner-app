"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useWheel, useWheelYear, useSaveWheel } from "@/hooks/use-wheel";
import { useCategories } from "@/hooks/use-goals";
import { WheelRadarChart, ScoreEntry } from "@/components/wheel/radar-chart";
import { ScoreInput, CategoryScore } from "@/components/wheel/score-input";
import { WheelHistory } from "@/components/wheel/wheel-history";

const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function WheelPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-based

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [historyYear, setHistoryYear] = useState(currentYear);

  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: currentEntries, isLoading: currLoading } = useWheel(currentYear, selectedMonth);
  const { data: prevEntries } = useWheel(
    currentYear,
    selectedMonth > 1 ? selectedMonth - 1 : 12
  );
  const { data: yearEntries } = useWheelYear(historyYear);
  const saveWheel = useSaveWheel();

  const isLoading = catLoading || currLoading;

  // Build CategoryScore[] for the score input (merge DB entries with categories)
  const scoreInputData: CategoryScore[] = useMemo(() => {
    if (!categories) return [];
    return categories.map((cat: any) => {
      const entry = (currentEntries ?? []).find((e: any) => e.categoryId === cat.id);
      return {
        categoryId: cat.id,
        category: cat.name,
        score: entry?.score ?? 5,
      };
    });
  }, [categories, currentEntries]);

  // Build ScoreEntry[] for the radar chart (current)
  const radarCurrent: ScoreEntry[] = useMemo(
    () => scoreInputData.map((s) => ({ category: s.category, score: s.score })),
    [scoreInputData]
  );

  // Build ScoreEntry[] for the radar chart (previous month)
  const radarPrevious: ScoreEntry[] = useMemo(() => {
    if (!categories || !prevEntries) return [];
    return categories.map((cat: any) => {
      const entry = (prevEntries as any[]).find((e: any) => e.categoryId === cat.id);
      return { category: cat.name, score: entry?.score ?? 0 };
    });
  }, [categories, prevEntries]);

  const hasPreviousData = radarPrevious.some((r) => r.score > 0);

  function handleSave(scores: CategoryScore[]) {
    saveWheel.mutate(
      {
        year: currentYear,
        month: selectedMonth,
        scores: scores.map((s) => ({ categoryId: s.categoryId, score: s.score })),
      },
      { onSuccess: () => toast.success("Оценки сохранены") }
    );
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center h-40">
        Загрузка...
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold">Колесо жизни</h1>
        <p className="text-muted-foreground mt-1">
          Оцените каждую сферу жизни от 1 до 10
        </p>
      </motion.div>

      {/* Month selector */}
      <motion.div variants={fadeInUp} className="flex flex-wrap gap-2">
        {MONTH_NAMES.map((name, idx) => {
          const month = idx + 1;
          const isSelected = month === selectedMonth;
          const isCurrent = month === currentMonth;
          return (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={[
                "px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 border",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : isCurrent
                    ? "border-primary/50 text-primary hover:bg-primary/10"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              ].join(" ")}
            >
              {name}
            </button>
          );
        })}
      </motion.div>

      {/* Main content: radar + inputs */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Radar chart */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">
              {MONTH_NAMES[selectedMonth - 1]} {currentYear}
            </h2>
            {hasPreviousData && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-4 rounded bg-[#6366f1] opacity-50" />
                  Текущий
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-0.5 w-4 rounded bg-[#94a3b8] border-dashed" />
                  Прошлый
                </span>
              </div>
            )}
          </div>
          <WheelRadarChart
            current={radarCurrent}
            previous={hasPreviousData ? radarPrevious : undefined}
          />
        </div>

        {/* Score inputs */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold mb-4">Оценки</h2>
          <ScoreInput
            scores={scoreInputData}
            onSave={handleSave}
            isSaving={saveWheel.isPending}
          />
        </div>
      </motion.div>

      {/* History section */}
      <motion.div
        variants={fadeInUp}
        className="rounded-xl border bg-card p-5 shadow-sm"
      >
        <WheelHistory
          data={yearEntries ?? []}
          categories={categories ?? []}
          year={historyYear}
          onYearChange={setHistoryYear}
        />
      </motion.div>
    </motion.div>
  );
}
