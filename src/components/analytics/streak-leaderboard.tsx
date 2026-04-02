"use client";

import { useStreaks } from "@/hooks/use-streaks";

export function StreakLeaderboard() {
  const { data, isLoading } = useStreaks();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-muted" />
        ))}
      </div>
    );
  }

  const top5 = (data ?? []).slice(0, 5);

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
      {top5.map((habit: any, index: number) => (
        <div
          key={habit.templateId}
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
