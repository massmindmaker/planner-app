"use client";

import { useHeatmap } from "@/hooks/use-analytics";
import { useMemo, useState } from "react";
import { format, startOfYear, addDays, getDay } from "date-fns";
import { ru } from "date-fns/locale";

type HeatmapEntry = {
  date: string;
  total: number;
  completed: number;
  percentage: number;
};

function getColor(percentage: number, total: number): string {
  if (total === 0) return "bg-muted";
  if (percentage === 0) return "bg-muted";
  if (percentage < 25) return "bg-emerald-100 dark:bg-emerald-950";
  if (percentage < 50) return "bg-emerald-300 dark:bg-emerald-700";
  if (percentage < 75) return "bg-emerald-500 dark:bg-emerald-500";
  return "bg-emerald-700 dark:bg-emerald-400";
}

export function Heatmap({ year }: { year?: number }) {
  const currentYear = year ?? new Date().getFullYear();
  const { data, isLoading } = useHeatmap(currentYear);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; entry: HeatmapEntry } | null>(null);

  const { grid, monthLabels } = useMemo(() => {
    const dataMap = new Map<string, HeatmapEntry>();
    if (data) {
      for (const entry of data as HeatmapEntry[]) {
        dataMap.set(entry.date, entry);
      }
    }

    // Build a 7×53 grid (rows = day of week Mon-Sun, cols = weeks)
    const jan1 = startOfYear(new Date(currentYear, 0, 1));
    // Align to Monday: getDay returns 0=Sun,1=Mon...6=Sat; we want Mon=0
    const dayOfWeek = getDay(jan1); // 0=Sun
    const offsetToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const gridStart = addDays(jan1, -offsetToMon);

    const weeks: (HeatmapEntry | null)[][] = [];
    let monthLabelsArr: { col: number; label: string }[] = [];
    let prevMonth = -1;

    for (let w = 0; w < 53; w++) {
      const week: (HeatmapEntry | null)[] = [];
      for (let d = 0; d < 7; d++) {
        const date = addDays(gridStart, w * 7 + d);
        const dateStr = format(date, "yyyy-MM-dd");
        const entry = dataMap.get(dateStr) ?? null;
        week.push(
          date.getFullYear() === currentYear
            ? entry ?? { date: dateStr, total: 0, completed: 0, percentage: 0 }
            : null
        );

        if (d === 0 && date.getFullYear() === currentYear) {
          const month = date.getMonth();
          if (month !== prevMonth) {
            monthLabelsArr.push({
              col: w,
              label: format(date, "MMM", { locale: ru }),
            });
            prevMonth = month;
          }
        }
      }
      weeks.push(week);
    }

    return { grid: weeks, monthLabels: monthLabelsArr };
  }, [data, currentYear]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-24 rounded bg-muted" />
      </div>
    );
  }

  const DAY_LABELS = ["Пн", "Ср", "Пт"];
  const DAY_ROWS = [0, 2, 4]; // rows to label (Mon, Wed, Fri)

  return (
    <div className="relative">
      {/* Month labels */}
      <div className="flex mb-1 ml-7 text-[10px] text-muted-foreground">
        {monthLabels.map(({ col, label }) => (
          <div
            key={col}
            className="absolute text-[10px] text-muted-foreground capitalize"
            style={{ left: `${col * 12 + 28}px` }}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-[2px]">
        {/* Day-of-week labels */}
        <div className="flex flex-col gap-[2px] mr-1">
          {Array.from({ length: 7 }, (_, i) => {
            const labelIdx = DAY_ROWS.indexOf(i);
            return (
              <div key={i} className="h-[10px] w-5 text-[9px] text-muted-foreground leading-[10px]">
                {labelIdx >= 0 ? DAY_LABELS[labelIdx] : ""}
              </div>
            );
          })}
        </div>
        {/* Grid */}
        <div className="flex gap-[2px] overflow-x-auto pb-1">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((entry, di) => {
                if (!entry) {
                  return <div key={di} className="h-[10px] w-[10px] rounded-sm" />;
                }
                return (
                  <div
                    key={di}
                    className={`h-[10px] w-[10px] rounded-sm cursor-pointer transition-opacity hover:opacity-75 ${getColor(entry.percentage, entry.total)}`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({ x: rect.left, y: rect.top, entry });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
        <span>Меньше</span>
        {["bg-muted", "bg-emerald-100 dark:bg-emerald-950", "bg-emerald-300 dark:bg-emerald-700", "bg-emerald-500", "bg-emerald-700 dark:bg-emerald-400"].map((cls, i) => (
          <div key={i} className={`h-[10px] w-[10px] rounded-sm ${cls}`} />
        ))}
        <span>Больше</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1.5 rounded-md bg-popover text-popover-foreground text-xs shadow-md border pointer-events-none"
          style={{ left: tooltip.x + 14, top: tooltip.y - 40 }}
        >
          <div className="font-medium">
            {format(new Date(tooltip.entry.date), "d MMMM yyyy", { locale: ru })}
          </div>
          <div className="text-muted-foreground">
            {tooltip.entry.completed}/{tooltip.entry.total} привычек ({tooltip.entry.percentage}%)
          </div>
        </div>
      )}
    </div>
  );
}
