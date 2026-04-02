"use client";

import { useDailyHabits } from "@/hooks/use-daily-habits";
import { useMemo } from "react";

type Habit = {
  id: number;
  name: string;
};

type Entry = {
  habitId: number;
  date: string;
  completed: boolean;
};

type StreakStat = {
  id: number;
  name: string;
  streak: number;
};

function computeCurrentStreak(entries: Entry[], habitId: number): number {
  const dates = entries
    .filter((e) => e.habitId === habitId && e.completed)
    .map((e) => e.date)
    .sort()
    .reverse();

  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let current = today;

  for (const dateStr of dates) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((current.getTime() - d.getTime()) / 86400000);
    if (diff === 0 || diff === 1) {
      streak++;
      current = d;
    } else {
      break;
    }
  }

  return streak;
}

export function StreakLeaderboard() {
  const now = new Date();
  const month = now.getMonth() + 1;

  const { data, isLoading } = useDailyHabits(month);

  const top5 = useMemo<StreakStat[]>(() => {
    if (!data) return [];
    const habits: Habit[] = data.habits ?? [];
    const entries: Entry[] = data.entries ?? [];

    return habits
      .map((habit) => ({
        id: habit.id,
        name: habit.name,
        streak: computeCurrentStreak(entries, habit.id),
      }))
      .filter((h) => h.streak > 0)
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-muted" />
        ))}
      </div>
    );
  }

  if (top5.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Нет активных серий — начните отмечать привычки!
      </p>
    );
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-2">
      {top5.map((habit, index) => (
        <div
          key={habit.id}
          className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
        >
          <span className="text-lg w-7 text-center">
            {medals[index] ?? "🔥"}
          </span>
          <span className="flex-1 text-sm font-medium truncate">{habit.name}</span>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-base">🔥</span>
            <span className="text-sm font-bold text-orange-500">{habit.streak}</span>
            <span className="text-xs text-muted-foreground">дн.</span>
          </div>
        </div>
      ))}
    </div>
  );
}
