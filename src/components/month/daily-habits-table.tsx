"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HabitCheckbox } from "./habit-checkbox";
import { useDailyHabits, useCreateDailyHabit, useDeleteDailyHabit, useToggleDailyEntry } from "@/hooks/use-daily-habits";
import { getDaysInMonth, getDayOfWeek, getWeekNumber, CURRENT_YEAR } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DailyHabitsTableProps {
  month: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value;
    const duration = 0.6;

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <>{display}</>;
}

function isToday(year: number, month: number, day: number): boolean {
  const now = new Date();
  return now.getFullYear() === year && now.getMonth() + 1 === month && now.getDate() === day;
}

function isWeekend(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month - 1, day).getDay();
  return dow === 0 || dow === 6;
}

export function DailyHabitsTable({ month }: DailyHabitsTableProps) {
  const { data, isLoading } = useDailyHabits(month);
  const createHabit = useCreateDailyHabit();
  const deleteHabit = useDeleteDailyHabit();
  const toggleEntry = useToggleDailyEntry();
  const [newName, setNewName] = useState("");
  const [addFocused, setAddFocused] = useState(false);

  const days = getDaysInMonth(CURRENT_YEAR, month);
  const habits = data?.habits ?? [];
  const entries = data?.entries ?? [];

  const isChecked = (habitId: number, day: number) => {
    const dateStr = `${CURRENT_YEAR}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return entries.some((e: any) => e.habitId === habitId && e.date === dateStr && e.completed);
  };

  const handleToggle = (habitId: number, day: number, checked: boolean) => {
    const dateStr = `${CURRENT_YEAR}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    toggleEntry.mutate({ id: habitId, date: dateStr, completed: checked });
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    createHabit.mutate({
      month,
      name: newName.trim(),
      position: habits.length + 1,
      year: CURRENT_YEAR,
    });
    setNewName("");
  };

  const getTotal = (habitId: number) =>
    entries.filter((e: any) => e.habitId === habitId && e.completed).length;

  const getDayProgress = (day: number) => {
    if (habits.length === 0) return 0;
    const checked = habits.filter((h: any) => isChecked(h.id, day)).length;
    return Math.round((checked / habits.length) * 100);
  };

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Ежедневные привычки</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-1 min-w-[140px] sticky left-0 bg-card z-10">Привычка</th>
              {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                const weekNum = getWeekNumber(CURRENT_YEAR, month, d);
                const prevWeek = d > 1 ? getWeekNumber(CURRENT_YEAR, month, d - 1) : 0;
                const today = isToday(CURRENT_YEAR, month, d);
                const weekend = isWeekend(CURRENT_YEAR, month, d);
                return (
                  <th
                    key={d}
                    className={cn(
                      "p-1 text-center min-w-[28px]",
                      weekNum !== prevWeek && d > 1 && "border-l-2 border-muted-foreground/20",
                      weekend && "bg-muted/40"
                    )}
                  >
                    <div className={cn("flex flex-col items-center", today && "relative")}>
                      <span>{getDayOfWeek(CURRENT_YEAR, month, d)}</span>
                      {today ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                          {d}
                        </span>
                      ) : (
                        <span className="font-normal text-muted-foreground">{d}</span>
                      )}
                    </div>
                  </th>
                );
              })}
              <th className="p-1 text-center min-w-[40px]">Цель</th>
              <th className="p-1 text-center min-w-[40px]">Итого</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {habits.map((habit: any, idx: number) => (
                <motion.tr
                  key={habit.id}
                  className="border-t group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  layout
                >
                  <td className="p-1 sticky left-0 bg-card z-10">
                    <motion.div
                      className="flex items-center gap-1"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="truncate cursor-default hover:text-primary transition-colors">
                        {habit.name}
                      </span>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => deleteHabit.mutate(habit.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </td>
                  {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                    const weekNum = getWeekNumber(CURRENT_YEAR, month, d);
                    const prevWeek = d > 1 ? getWeekNumber(CURRENT_YEAR, month, d - 1) : 0;
                    const weekend = isWeekend(CURRENT_YEAR, month, d);
                    return (
                      <td
                        key={d}
                        className={cn(
                          "p-1 text-center",
                          weekNum !== prevWeek && d > 1 && "border-l-2 border-muted-foreground/20",
                          weekend && "bg-muted/40"
                        )}
                      >
                        <HabitCheckbox
                          checked={isChecked(habit.id, d)}
                          onToggle={(c) => handleToggle(habit.id, d, c)}
                        />
                      </td>
                    );
                  })}
                  <td className="p-1 text-center text-muted-foreground">{habit.goal ?? "\u2014"}</td>
                  <td className="p-1 text-center font-medium">
                    <AnimatedNumber value={getTotal(habit.id)} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {/* Progress row */}
            <motion.tr
              className="border-t-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: habits.length * 0.05 + 0.1 }}
            >
              <td className="p-1 text-muted-foreground sticky left-0 bg-card z-10">Прогресс</td>
              {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                const pct = getDayProgress(d);
                const weekend = isWeekend(CURRENT_YEAR, month, d);
                return (
                  <td key={d} className={cn("p-1 text-center", weekend && "bg-muted/40")}>
                    {habits.length > 0 && (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-mono text-[10px] text-muted-foreground">{pct}%</span>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, rgb(239 68 68), rgb(234 179 8), rgb(34 197 94))`,
                              backgroundSize: "200% 100%",
                              backgroundPosition: `${100 - pct}% 0`,
                            }}
                            initial={{ width: "0%" }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                );
              })}
              <td />
              <td />
            </motion.tr>
          </tbody>
        </table>

        {/* Add habit */}
        <motion.div
          className="flex gap-2 mt-3"
          animate={{
            height: addFocused ? 44 : 36,
            scale: addFocused ? 1.01 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            onFocus={() => setAddFocused(true)}
            onBlur={() => setAddFocused(false)}
            placeholder="Новая привычка..."
            className={cn(
              "text-sm transition-all duration-200",
              addFocused ? "h-10 ring-2 ring-primary/30" : "h-8"
            )}
          />
          <Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>
            <Plus className="h-3 w-3 mr-1" /> Добавить
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
