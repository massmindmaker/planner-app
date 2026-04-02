"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface ScoreEntry {
  category: string;
  score: number;
}

interface WheelRadarChartProps {
  current: ScoreEntry[];
  previous?: ScoreEntry[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Карьера: "#3b82f6",
  Финансы: "#10b981",
  Творчество: "#8b5cf6",
  "Личное развитие": "#f59e0b",
  Взаимоотношения: "#f43f5e",
  Духовность: "#a855f7",
};

const DEFAULT_COLOR = "#6366f1";

function getCategoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? DEFAULT_COLOR;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { category: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const category = payload[0]?.payload?.category;
  const color = getCategoryColor(category);
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-md text-sm">
      <p className="font-medium mb-1" style={{ color }}>
        {category}
      </p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name === "current" ? "Текущий месяц" : "Прошлый месяц"}:{" "}
          <span className="font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function WheelRadarChart({ current, previous }: WheelRadarChartProps) {
  // Merge current and previous into a single data array keyed by category
  const data = current.map((c) => {
    const prev = previous?.find((p) => p.category === c.category);
    return {
      category: c.category,
      current: c.score,
      ...(prev ? { previous: prev.score } : {}),
    };
  });

  const hasPrevious = previous && previous.length > 0;

  return (
    <ResponsiveContainer width="100%" height={340}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="currentColor" className="text-border" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fontSize: 12, fill: "currentColor", className: "text-muted-foreground" }}
        />
        {hasPrevious && (
          <Radar
            name="previous"
            dataKey="previous"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.08}
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        )}
        <Radar
          name="current"
          dataKey="current"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
