"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUpdateGoal } from "@/hooks/use-goals";

interface GoalRowProps {
  goal: {
    id: number;
    position: number;
    title: string;
    completed: boolean;
    dailyHabit: string | null;
    weeklyHabit: string | null;
    monthlyHabit: string | null;
  };
}

export function GoalRow({ goal }: GoalRowProps) {
  const [title, setTitle] = useState(goal.title);
  const [dailyHabit, setDailyHabit] = useState(goal.dailyHabit ?? "");
  const [weeklyHabit, setWeeklyHabit] = useState(goal.weeklyHabit ?? "");
  const [monthlyHabit, setMonthlyHabit] = useState(goal.monthlyHabit ?? "");
  const updateGoal = useUpdateGoal();

  const handleBlur = (field: string, value: string, original: string | null) => {
    if (value !== (original ?? "")) {
      updateGoal.mutate({ id: goal.id, data: { [field]: value || null } });
    }
  };

  const handleToggle = (checked: boolean) => {
    updateGoal.mutate({ id: goal.id, data: { completed: checked } });
  };

  return (
    <div className="space-y-1 py-1.5 border-b last:border-0">
      <div className="flex items-center gap-2">
        <Checkbox checked={goal.completed} onCheckedChange={handleToggle} />
        <span className="text-xs text-muted-foreground w-4">{goal.position}.</span>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleBlur("title", title, goal.title)}
          placeholder="Введите цель..."
          className={cn("h-7 text-sm", goal.completed && "line-through text-muted-foreground")}
        />
      </div>
      <div className="ml-8 grid grid-cols-3 gap-1">
        <Input
          value={dailyHabit}
          onChange={(e) => setDailyHabit(e.target.value)}
          onBlur={() => handleBlur("dailyHabit", dailyHabit, goal.dailyHabit)}
          placeholder="Ежедневная..."
          className="h-6 text-xs"
        />
        <Input
          value={weeklyHabit}
          onChange={(e) => setWeeklyHabit(e.target.value)}
          onBlur={() => handleBlur("weeklyHabit", weeklyHabit, goal.weeklyHabit)}
          placeholder="Еженедельная..."
          className="h-6 text-xs"
        />
        <Input
          value={monthlyHabit}
          onChange={(e) => setMonthlyHabit(e.target.value)}
          onBlur={() => handleBlur("monthlyHabit", monthlyHabit, goal.monthlyHabit)}
          placeholder="Ежемесячная..."
          className="h-6 text-xs"
        />
      </div>
    </div>
  );
}
