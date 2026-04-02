"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const MONTH_LABELS = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

const CATEGORY_COLORS: Record<string, string> = {
  Карьера: "#3b82f6",
  Финансы: "#10b981",
  Творчество: "#8b5cf6",
  "Личное развитие": "#f59e0b",
  Взаимоотношения: "#f43f5e",
  Духовность: "#a855f7",
};

const DEFAULT_COLOR = "#6366f1";

interface WheelEntry {
  year: number;
  month: number;
  categoryId: number;
  score: number;
}

interface Category {
  id: number;
  name: string;
}

interface WheelHistoryProps {
  data: WheelEntry[];
  categories: Category[];
  year: number;
  onYearChange: (year: number) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-md text-sm space-y-1">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: p.color }}
          />
          {p.name}:{" "}
          <span className="font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function WheelHistory({ data, categories, year, onYearChange }: WheelHistoryProps) {
  // Build chartData: one entry per month with each category's score
  const chartData = MONTH_LABELS.map((label, idx) => {
    const month = idx + 1;
    const entry: Record<string, string | number> = { month: label };
    for (const cat of categories) {
      const found = data.find((d) => d.month === month && d.categoryId === cat.id);
      if (found) {
        entry[cat.name] = found.score;
      }
    }
    return entry;
  });

  const yearOptions = Array.from({ length: 5 }, (_, i) => year - 2 + i);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">История по месяцам</h3>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border opacity-50" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11 }}
          />
          {categories.map((cat) => (
            <Line
              key={cat.id}
              type="monotone"
              dataKey={cat.name}
              stroke={CATEGORY_COLORS[cat.name] ?? DEFAULT_COLOR}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
