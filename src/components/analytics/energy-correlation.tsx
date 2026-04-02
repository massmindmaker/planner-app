"use client";

import { useEnergyCorrelation } from "@/hooks/use-analytics";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

type CorrelationEntry = {
  date: string;
  energy: number;
  completionPercent: number;
};

export function EnergyCorrelation({ year }: { year?: number }) {
  const { data, isLoading } = useEnergyCorrelation(year);

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  const points = (data as CorrelationEntry[] | undefined) ?? [];

  if (points.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Недостаточно данных — добавьте уровень энергии на странице недели
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ScatterChart margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          dataKey="energy"
          domain={[0, 10]}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          label={{ value: "Энергия", position: "insideBottom", offset: -2, fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          type="number"
          dataKey="completionPercent"
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          content={({ payload }) => {
            if (!payload?.length) return null;
            const d = payload[0]?.payload as CorrelationEntry;
            return (
              <div
                className="px-2 py-1.5 rounded-md shadow-md border text-xs"
                style={{
                  background: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--popover-foreground))",
                }}
              >
                <div className="font-medium">
                  {format(new Date(d.date), "d MMM", { locale: ru })}
                </div>
                <div className="text-muted-foreground">Энергия: {d.energy}/10</div>
                <div className="text-muted-foreground">Выполнение: {d.completionPercent}%</div>
              </div>
            );
          }}
        />
        <Scatter
          data={points}
          fill="#6366f1"
          opacity={0.7}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
