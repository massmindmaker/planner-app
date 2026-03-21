"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES } from "@/lib/utils";
import { useMonthStats } from "@/hooks/use-stats";

interface MonthHeaderProps {
  month: number;
}

function AnimatedNumber({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value;

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <>{display}</>;
}

function getProgressColor(progress: number): string {
  if (progress < 30) return "text-red-500";
  if (progress <= 70) return "text-amber-500";
  return "text-green-500";
}

function getProgressBarColor(progress: number): string {
  if (progress < 30) return "bg-red-500";
  if (progress <= 70) return "bg-amber-500";
  return "bg-green-500";
}

export function MonthHeader({ month }: MonthHeaderProps) {
  const { data: stats } = useMonthStats(month);
  const prevMonth = month > 1 ? month - 1 : 12;
  const nextMonth = month < 12 ? month + 1 : 1;
  const progress = stats?.progress ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href={`/month/${prevMonth}`}>
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </motion.div>
        </Link>
        <h1
          className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent"
        >
          {MONTH_NAMES[month - 1]}
        </h1>
        <Link href={`/month/${nextMonth}`}>
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                <AnimatedNumber value={stats?.totalHabits ?? 0} />
              </p>
              <p className="text-xs text-muted-foreground">Привычек</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                <AnimatedNumber value={stats?.completedEntries ?? 0} />
              </p>
              <p className="text-xs text-muted-foreground">Выполнено</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${getProgressColor(progress)}`}>
                <AnimatedNumber value={progress} />%
              </p>
              <p className="text-xs text-muted-foreground">Прогресс</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Animated progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getProgressBarColor(progress)}`}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 15,
            mass: 1,
          }}
        />
      </div>
    </div>
  );
}
