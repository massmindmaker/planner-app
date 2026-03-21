"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { HabitCheckbox } from "./habit-checkbox";
import { useWeeklyHabits, useCreateWeeklyHabit, useDeleteWeeklyHabit, useToggleWeeklyEntry } from "@/hooks/use-weekly-habits";
import { CURRENT_YEAR } from "@/lib/utils";
import { useState } from "react";

interface WeeklyHabitsTableProps {
  month: number;
}

export function WeeklyHabitsTable({ month }: WeeklyHabitsTableProps) {
  const { data, isLoading } = useWeeklyHabits(month);
  const createHabit = useCreateWeeklyHabit();
  const deleteHabit = useDeleteWeeklyHabit();
  const toggleEntry = useToggleWeeklyEntry();
  const [newName, setNewName] = useState("");

  const habits = data?.habits ?? [];
  const entries = data?.entries ?? [];

  const isChecked = (habitId: number, week: number) =>
    entries.some((e: any) => e.habitId === habitId && e.week === week && e.completed);

  const handleToggle = (habitId: number, week: number, checked: boolean) => {
    toggleEntry.mutate({ id: habitId, week, completed: checked });
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

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Еженедельные привычки</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Привычка</th>
              {[1, 2, 3, 4, 5].map((w) => (
                <th key={w} className="p-2 text-center">Неделя {w}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit: any) => (
              <tr key={habit.id} className="border-t">
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span>{habit.name}</span>
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
                {[1, 2, 3, 4, 5].map((w) => (
                  <td key={w} className="p-2 text-center">
                    <HabitCheckbox
                      checked={isChecked(habit.id, w)}
                      onToggle={(c) => handleToggle(habit.id, w, c)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-2 mt-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Новая еженедельная привычка..."
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
