"use client";
import { useYearStats } from "@/hooks/use-stats";
import { MonthCard } from "@/components/dashboard/month-card";
import { YearProgress } from "@/components/dashboard/year-progress";
import { GoalsSummary } from "@/components/dashboard/goals-summary";

export default function DashboardPage() {
  const { data, isLoading } = useYearStats();

  if (isLoading) return <div className="text-muted-foreground">Загрузка...</div>;

  const months = data?.months ?? [];
  const goals = data?.goals ?? { total: 0, completed: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Обзор</h1>
        <p className="text-muted-foreground mt-1">
          «Либо ты пишешь свой план сам, либо кто-то другой использует тебя в своём.»
        </p>
      </div>

      <YearProgress months={months} />
      <GoalsSummary total={goals.total} completed={goals.completed} />

      <div>
        <h2 className="text-lg font-semibold mb-3">Месяцы</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {months.map((m: any) => (
            <MonthCard
              key={m.month}
              month={m.month}
              progress={m.progress}
              totalHabits={m.totalHabits}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
