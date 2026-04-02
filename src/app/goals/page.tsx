"use client";
import { useCategories, useGoals } from "@/hooks/use-goals";
import { CategoryCard } from "@/components/goals/category-card";
import { QuarterTheme } from "@/components/dashboard/quarter-theme";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionVal, value, { duration: 0.8, ease: "easeOut" });
    return controls.stop;
  }, [value, motionVal]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(v);
    });
    return unsubscribe;
  }, [rounded]);

  return <span ref={ref}>0</span>;
}

export default function GoalsPage() {
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: goals, isLoading: goalsLoading } = useGoals();

  if (catLoading || goalsLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard className="h-16" />
        <SkeletonCard className="h-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const allGoals = goals ?? [];
  const completedCount = allGoals.filter((g: any) => g.completed).length;
  const totalCount = allGoals.length;

  return (
    <div className="space-y-6">
      <QuarterTheme />

      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-2xl font-bold">Цели на год</h1>
        <p className="text-muted-foreground mt-1">
          «Если у тебя есть план на миллион, не спрашивай совета у тех, кто живёт на десять тысяч.»
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm"
      >
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <span className="text-2xl font-bold text-primary">
            <AnimatedCounter value={completedCount} />
          </span>
          <span className="text-muted-foreground">из</span>
          <span className="text-2xl font-bold">
            <AnimatedCounter value={totalCount} />
          </span>
          <span className="text-muted-foreground">целей выполнено</span>
        </div>
        {totalCount > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </span>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(categories ?? []).map((cat: any, index: number) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.3 + index * 0.1,
              ease: "easeOut",
            }}
          >
            <CategoryCard
              category={cat}
              goals={(allGoals).filter((g: any) => g.categoryId === cat.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
