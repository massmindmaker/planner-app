"use client";

import { useMonthStats } from "@/hooks/use-stats";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

export function MonthComparison() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-indexed
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? now.getFullYear() - 1 : now.getFullYear();

  const { data: currData, isLoading: currLoading } = useMonthStats(currentMonth);
  const { data: prevData, isLoading: prevLoading } = useMonthStats(prevMonth, prevYear);

  if (currLoading || prevLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  const MONTH_SHORT: Record<number, string> = {
    1: "Янв", 2: "Фев", 3: "Мар", 4: "Апр", 5: "Май", 6: "Июн",
    7: "Июл", 8: "Авг", 9: "Сен", 10: "Окт", 11: "Ноя", 12: "Дек",
  };

  const chartData = [
    {
      name: MONTH_SHORT[prevMonth] ?? "Пред.",
      percentage: (prevData as any)?.progress ?? 0,
      type: "prev",
    },
    {
      name: MONTH_SHORT[currentMonth] ?? "Тек.",
      percentage: (currData as any)?.progress ?? 0,
      type: "current",
    },
  ];

  const diff = chartData[1].percentage - chartData[0].percentage;
  const diffLabel = diff > 0 ? `+${diff}%` : `${diff}%`;
  const diffColor = diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-muted-foreground";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Изменение:</span>
        <span className={`font-semibold ${diffColor}`}>{diff === 0 ? "Без изменений" : diffLabel}</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 13, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value: any) => [`${value}%`, "Выполнение"]}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
          <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={80}>
            <Cell fill="#94a3b8" />
            <Cell fill="#6366f1" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
