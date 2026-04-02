"use client";
import { useMemo } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfISOWeek, endOfISOWeek, setISOWeek, eachDayOfInterval } from "date-fns";
import { ru } from "date-fns/locale";
import { useDailyHabits } from "@/hooks/use-daily-habits";
import { CURRENT_YEAR } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WeekHabitsSummaryProps {
  week: number;
  year?: number;
}

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getWeekDates(week: number, year: number): Date[] {
  const weekDate = setISOWeek(new Date(year, 0, 4), week);
  weekDate.setFullYear(year);
  const start = startOfISOWeek(weekDate);
  const end = endOfISOWeek(weekDate);
  return eachDayOfInterval({ start, end });
}

function CellStatus({
  completed,
  isMinimum,
  polarity,
}: {
  completed: boolean | null;
  isMinimum?: boolean;
  polarity?: string;
}) {
  if (completed === null)
    return (
      <div className="w-7 h-7 rounded-md bg-muted/30 border border-muted" />
    );

  const isNegative = polarity === "negative";

  if (completed) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold",
          isNegative ? "bg-red-500" : isMinimum ? "bg-amber-500" : "bg-green-500"
        )}
      >
        {isNegative ? "✗" : "✓"}
      </motion.div>
    );
  }

  return <div className="w-7 h-7 rounded-md bg-muted/50 border border-muted/60" />;
}

export function WeekHabitsSummary({ week, year = CURRENT_YEAR }: WeekHabitsSummaryProps) {
  const weekDates = useMemo(() => getWeekDates(week, year), [week, year]);

  // Determine which months are needed (a week can span 2 months)
  const months = useMemo(() => {
    const set = new Set(weekDates.map((d) => d.getMonth() + 1));
    return Array.from(set);
  }, [weekDates]);

  const month1Data = useDailyHabits(months[0], year);
  const month2Data = useDailyHabits(months[1] ?? months[0], year);

  const { habits, entriesByHabitAndDate } = useMemo(() => {
    const allHabits: any[] = [];
    const allEntries: any[] = [];

    [month1Data, months[1] !== undefined ? month2Data : null].forEach((d) => {
      if (!d?.data) return;
      const { habits: h = [], entries: e = [] } = d.data;
      h.forEach((habit: any) => {
        if (!allHabits.find((x) => x.id === habit.id)) allHabits.push(habit);
      });
      allEntries.push(...e);
    });

    const byHabitAndDate: Record<string, { completed: boolean; isMinimum: boolean }> = {};
    allEntries.forEach((e: any) => {
      byHabitAndDate[`${e.habitId}_${e.date}`] = {
        completed: e.completed,
        isMinimum: e.isMinimum,
      };
    });

    return { habits: allHabits, entriesByHabitAndDate: byHabitAndDate };
  }, [month1Data.data, month2Data.data]);

  const isLoading = month1Data.isLoading || (months.length > 1 && month2Data.isLoading);

  if (isLoading) {
    return (
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Привычки недели</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center text-muted-foreground text-sm">
            Загрузка...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (habits.length === 0) {
    return (
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Привычки недели</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Нет привычек для этой недели
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Привычки недели</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr>
              <th className="text-left text-xs text-muted-foreground font-medium pb-2 pr-2 min-w-[120px]">
                Привычка
              </th>
              {weekDates.map((d, i) => (
                <th key={i} className="text-center text-xs text-muted-foreground font-medium pb-2 px-1">
                  <div>{DAY_LABELS[i]}</div>
                  <div className="text-[10px] opacity-70">{format(d, "d", { locale: ru })}</div>
                </th>
              ))}
              <th className="text-center text-xs text-muted-foreground font-medium pb-2 pl-2">
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, idx) => {
              const cells = weekDates.map((d) => {
                const dateStr = format(d, "yyyy-MM-dd");
                return entriesByHabitAndDate[`${habit.id}_${dateStr}`] ?? null;
              });

              const completedCount = cells.filter((c) => c?.completed).length;
              const applicableDays = weekDates.length;
              const pct = Math.round((completedCount / applicableDays) * 100);

              return (
                <motion.tr
                  key={habit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="border-t border-muted/40"
                >
                  <td className="py-1.5 pr-2 text-sm truncate max-w-[140px]" title={habit.name}>
                    {habit.name}
                  </td>
                  {cells.map((cell, di) => (
                    <td key={di} className="py-1.5 px-1 text-center">
                      <div className="flex justify-center">
                        <CellStatus
                          completed={cell ? cell.completed : null}
                          isMinimum={cell?.isMinimum}
                          polarity={habit.polarity}
                        />
                      </div>
                    </td>
                  ))}
                  <td className="py-1.5 pl-2 text-center">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        pct >= 70
                          ? "text-green-500"
                          : pct >= 40
                          ? "text-amber-500"
                          : "text-red-500"
                      )}
                    >
                      {pct}%
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
