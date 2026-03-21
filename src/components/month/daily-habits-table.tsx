"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { HabitCheckbox } from "./habit-checkbox";
import { useDailyHabits, useCreateDailyHabit, useDeleteDailyHabit, useToggleDailyEntry } from "@/hooks/use-daily-habits";
import { getDaysInMonth, getDayOfWeek, getWeekNumber, CURRENT_YEAR } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DailyHabitsTableProps {
  month: number;
}

export function DailyHabitsTable({ month }: DailyHabitsTableProps) {
  const { data, isLoading } = useDailyHabits(month);
  const createHabit = useCreateDailyHabit();
  const deleteHabit = useDeleteDailyHabit();
  const toggleEntry = useToggleDailyEntry();
  const [newName, setNewName] = useState("");

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
              <th className="text-left p-1 min-w-[140px] sticky left-0 bg-card">Привычка</th>
              {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                const weekNum = getWeekNumber(CURRENT_YEAR, month, d);
                const prevWeek = d > 1 ? getWeekNumber(CURRENT_YEAR, month, d - 1) : 0;
                return (
                  <th
                    key={d}
                    className={cn(
                      "p-1 text-center min-w-[28px]",
                      weekNum !== prevWeek && d > 1 && "border-l-2 border-muted-foreground/20"
                    )}
                  >
                    <div>{getDayOfWeek(CURRENT_YEAR, month, d)}</div>
                    <div className="font-normal text-muted-foreground">{d}</div>
                  </th>
                );
              })}
              <th className="p-1 text-center min-w-[40px]">Цель</th>
              <th className="p-1 text-center min-w-[40px]">Итого</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit: any) => (
              <tr key={habit.id} className="border-t">
                <td className="p-1 sticky left-0 bg-card">
                  <div className="flex items-center gap-1">
                    <span className="truncate">{habit.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 hover:opacity-100 shrink-0"
                      onClick={() => deleteHabit.mutate(habit.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
                {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                  const weekNum = getWeekNumber(CURRENT_YEAR, month, d);
                  const prevWeek = d > 1 ? getWeekNumber(CURRENT_YEAR, month, d - 1) : 0;
                  return (
                    <td
                      key={d}
                      className={cn(
                        "p-1 text-center",
                        weekNum !== prevWeek && d > 1 && "border-l-2 border-muted-foreground/20"
                      )}
                    >
                      <HabitCheckbox
                        checked={isChecked(habit.id, d)}
                        onToggle={(c) => handleToggle(habit.id, d, c)}
                      />
                    </td>
                  );
                })}
                <td className="p-1 text-center text-muted-foreground">{habit.goal ?? "—"}</td>
                <td className="p-1 text-center font-medium">{getTotal(habit.id)}</td>
              </tr>
            ))}
            {/* Progress row */}
            <tr className="border-t-2">
              <td className="p-1 text-muted-foreground sticky left-0 bg-card">Прогресс</td>
              {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                const pct = getDayProgress(d);
                const color =
                  pct === 0 ? "" : pct < 50 ? "text-red-500" : pct < 100 ? "text-yellow-500" : "text-green-500";
                return (
                  <td key={d} className={cn("p-1 text-center font-mono", color)}>
                    {habits.length > 0 ? `${pct}%` : ""}
                  </td>
                );
              })}
              <td />
              <td />
            </tr>
          </tbody>
        </table>

        {/* Add habit */}
        <div className="flex gap-2 mt-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Новая привычка..."
            className="h-8 text-sm"
          />
          <Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>
            <Plus className="h-3 w-3 mr-1" /> Добавить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
