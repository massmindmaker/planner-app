"use client";

import { useDailyHabits } from "@/hooks/use-daily-habits";
import { useMemo } from "react";

type Habit = {
  id: number;
  name: string;
};

type Entry = {
  habitId: number;
  completed: boolean;
};

type HabitStat = {
  id: number;
  name: string;
  completed: number;
  total: number;
  percentage: number;
};

function getBarColor(percentage: number): string {
  if (percentage >= 80) return "bg-emerald-500";
  if (percentage >= 60) return "bg-blue-500";
  if (percentage >= 40) return "bg-yellow-500";
  return "bg-red-400";
}

export function HabitRanking() {
  const now = new Date();
  const month = now.getMonth() + 1;

  const { data, isLoading } = useDailyHabits(month);

  const stats = useMemo<HabitStat[]>(() => {
    if (!data) return [];
    const habits: Habit[] = data.habits ?? [];
    const entries: Entry[] = data.entries ?? [];

    return habits
      .map((habit) => {
        const habitEntries = entries.filter((e) => e.habitId === habit.id);
        const completed = habitEntries.filter((e) => e.completed).length;
        const total = habitEntries.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { id: habit.id, name: habit.name, completed, total, percentage };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-8 animate-pulse rounded bg-muted" />
        ))}
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Нет привычек за текущий месяц
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {stats.map((habit, index) => (
        <div key={habit.id} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-5 text-right font-mono">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm truncate">{habit.name}</span>
              <span className="text-xs text-muted-foreground ml-2 shrink-0">
                {habit.completed}/{habit.total} ({habit.percentage}%)
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(habit.percentage)}`}
                style={{ width: `${habit.percentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
