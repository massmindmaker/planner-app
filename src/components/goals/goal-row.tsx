"use client";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUpdateGoal, useDeleteGoal } from "@/hooks/use-goals";
import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { InlineEdit } from "@/components/shared/inline-edit";
import { toast } from "sonner";

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
  accentColor?: string;
}

function AnimatedCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors duration-200",
        checked
          ? "border-green-500 bg-green-500"
          : "border-muted-foreground/40 bg-transparent hover:border-muted-foreground"
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3 w-3"
        stroke="white"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M4 12 L10 18 L20 6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: checked ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </svg>
    </button>
  );
}

export function GoalRow({ goal, accentColor }: GoalRowProps) {
  const [title, setTitle] = useState(goal.title);
  const [dailyHabit, setDailyHabit] = useState(goal.dailyHabit ?? "");
  const [weeklyHabit, setWeeklyHabit] = useState(goal.weeklyHabit ?? "");
  const [monthlyHabit, setMonthlyHabit] = useState(goal.monthlyHabit ?? "");
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const handleBlur = (field: string, value: string, original: string | null) => {
    if (value !== (original ?? "")) {
      updateGoal.mutate({ id: goal.id, data: { [field]: value || null } });
    }
  };

  const handleToggle = (checked: boolean) => {
    updateGoal.mutate({ id: goal.id, data: { completed: checked } });
  };

  const handleDelete = () => {
    // Optimistically hide
    setIsDeleted(true);

    toast("Удалено", {
      action: {
        label: "Отменить",
        onClick: () => {
          if (deleteTimerRef.current) {
            clearTimeout(deleteTimerRef.current);
            deleteTimerRef.current = null;
          }
          setIsDeleted(false);
        },
      },
      duration: 5000,
    });

    deleteTimerRef.current = setTimeout(() => {
      deleteGoal.mutate(goal.id);
      deleteTimerRef.current = null;
    }, 5000);
  };

  if (isDeleted) return null;

  return (
    <motion.div
      layout
      className={cn(
        "space-y-1 py-1.5 border-b last:border-0 rounded-sm px-1 transition-colors duration-300 group relative",
        goal.completed && "bg-green-50 dark:bg-green-950/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <AnimatedCheckbox checked={goal.completed} onChange={handleToggle} />
        <span className={cn("text-xs text-muted-foreground w-4", accentColor)}>
          {goal.position}.
        </span>
        <div className={cn(
          "flex-1 text-sm transition-all duration-300",
          goal.completed && "line-through text-muted-foreground"
        )}>
          <InlineEdit
            value={title}
            onSave={(val) => {
              setTitle(val);
              updateGoal.mutate({ id: goal.id, data: { title: val || null } });
            }}
            placeholder="Введите цель..."
            className="text-sm w-full"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
          transition={{ duration: 0.15 }}
          className="shrink-0"
        >
          <button
            type="button"
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Удалить цель"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </div>
      <div className="ml-8 grid grid-cols-3 gap-1">
        <div className="space-y-0.5">
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            Ежедн.
          </span>
          <Input
            value={dailyHabit}
            onChange={(e) => setDailyHabit(e.target.value)}
            onBlur={() => handleBlur("dailyHabit", dailyHabit, goal.dailyHabit)}
            placeholder="Привычка..."
            className="h-6 text-xs focus:ring-2 focus:ring-blue-300/40 transition-all"
          />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            Еженед.
          </span>
          <Input
            value={weeklyHabit}
            onChange={(e) => setWeeklyHabit(e.target.value)}
            onBlur={() => handleBlur("weeklyHabit", weeklyHabit, goal.weeklyHabit)}
            placeholder="Привычка..."
            className="h-6 text-xs focus:ring-2 focus:ring-amber-300/40 transition-all"
          />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            Ежемес.
          </span>
          <Input
            value={monthlyHabit}
            onChange={(e) => setMonthlyHabit(e.target.value)}
            onBlur={() => handleBlur("monthlyHabit", monthlyHabit, goal.monthlyHabit)}
            placeholder="Привычка..."
            className="h-6 text-xs focus:ring-2 focus:ring-violet-300/40 transition-all"
          />
        </div>
      </div>
    </motion.div>
  );
}
