"use client";
import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "motion/react";

interface Habit {
  id: number;
  name: string;
  routineOrder: number | null;
}

interface RoutineTimelineProps {
  habits: Habit[];
  completedIds?: Set<number>;
}

export function RoutineTimeline({ habits, completedIds = new Set() }: RoutineTimelineProps) {
  if (habits.length === 0) return null;

  return (
    <div className="relative pl-4">
      {/* Vertical line */}
      <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-border" />

      <div className="space-y-1">
        {habits.map((habit, index) => {
          const done = completedIds.has(habit.id);
          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              {/* Node */}
              <div className="relative z-10 flex items-center justify-center w-5 h-5 shrink-0">
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-sm py-1.5 ${
                  done ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {habit.name}
              </span>

              {/* Step number */}
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                {index + 1}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
