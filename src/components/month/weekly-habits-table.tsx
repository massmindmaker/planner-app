"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HabitCheckbox } from "./habit-checkbox";
import { useWeeklyHabits, useCreateWeeklyHabit, useDeleteWeeklyHabit, useToggleWeeklyEntry } from "@/hooks/use-weekly-habits";
import { CURRENT_YEAR } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface WeeklyHabitsTableProps {
  month: number;
}

export function WeeklyHabitsTable({ month }: WeeklyHabitsTableProps) {
  const { data, isLoading } = useWeeklyHabits(month);
  const createHabit = useCreateWeeklyHabit();
  const deleteHabit = useDeleteWeeklyHabit();
  const toggleEntry = useToggleWeeklyEntry();
  const [newName, setNewName] = useState("");
  const [addFocused, setAddFocused] = useState(false);

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
                  <td className="p-2">
                    <motion.div
                      className="flex items-center gap-1"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="cursor-default hover:text-primary transition-colors">
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
                  {[1, 2, 3, 4, 5].map((w) => (
                    <td key={w} className="p-2 text-center">
                      <HabitCheckbox
                        checked={isChecked(habit.id, w)}
                        onToggle={(c) => handleToggle(habit.id, w, c)}
                      />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
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
            placeholder="Новая еженедельная привычка..."
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
