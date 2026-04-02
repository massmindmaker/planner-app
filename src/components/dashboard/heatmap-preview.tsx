"use client";
import { motion } from "motion/react";
import { useHeatmap } from "@/hooks/use-analytics";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useMemo } from "react";

function getColorClass(percentage: number): string {
  if (percentage === 0) return "bg-muted/20";
  if (percentage < 25) return "bg-green-900/60";
  if (percentage < 50) return "bg-green-700/70";
  if (percentage < 75) return "bg-green-500/80";
  return "bg-green-400";
}

interface HeatmapDay {
  date: string;
  percentage: number;
}

export function HeatmapPreview() {
  const { data, isLoading } = useHeatmap();

  const last90Days = useMemo(() => {
    if (!data) return [];
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - 89);

    const dateMap = new Map<string, number>();
    for (const d of (data as HeatmapDay[])) {
      dateMap.set(d.date, d.percentage);
    }

    const days: { date: string; percentage: number }[] = [];
    const current = new Date(cutoff);
    while (current <= today) {
      const iso = current.toISOString().split("T")[0];
      days.push({ date: iso, percentage: dateMap.get(iso) ?? 0 });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Активность (90 дней)</h3>
          <Link
            href="/analytics"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Подробнее →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        {isLoading ? (
          <div className="h-10 animate-pulse bg-muted/30 rounded" />
        ) : (
          <motion.div
            className="flex flex-wrap gap-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {last90Days.map((day, i) => (
              <motion.div
                key={day.date}
                title={`${day.date}: ${day.percentage}%`}
                className={`w-2.5 h-2.5 rounded-sm ${getColorClass(day.percentage)}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.003, duration: 0.2 }}
              />
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
