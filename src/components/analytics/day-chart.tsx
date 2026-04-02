"use client";

import { useDayStats } from "@/hooks/use-analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

type DayEntry = {
  day: string;
  dayIndex: number;
  percentage: number;
};

const DAY_ORDER = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// Gradient colors from cool blue (Mon) to warm purple (Sun)
const BAR_COLORS = [
  "#6366f1", // Mon
  "#8b5cf6", // Tue
  "#a78bfa", // Wed
  "#c084fc", // Thu
  "#e879f9", // Fri
  "#f472b6", // Sat
  "#fb7185", // Sun
];

export function DayChart({ year }: { year?: number }) {
  const { data, isLoading } = useDayStats(year);

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  // Re-sort: Sun(0) → Mon(1)..Sat(6) into Mon..Sun order
  const raw = (data as DayEntry[] | undefined) ?? [];
  const chartData = DAY_ORDER.map((dayLabel) => {
    const entry = raw.find((e) => e.day === dayLabel) ?? { day: dayLabel, dayIndex: 0, percentage: 0 };
    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
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
        <Bar dataKey="percentage" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {chartData.map((entry, index) => (
            <Cell key={entry.day} fill={BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
