"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { InlineEdit } from "@/components/shared/inline-edit";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { useUpdateLifeGoal, useDeleteLifeGoal } from "@/hooks/use-life-goals";

interface LifeGoalRowProps {
  goal: {
    id: number;
    title: string;
    description: string | null;
    position: number;
  };
  accentColor?: string;
}

export function LifeGoalRow({ goal, accentColor }: LifeGoalRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const updateLifeGoal = useUpdateLifeGoal();
  const deleteLifeGoal = useDeleteLifeGoal();

  const handleTitleSave = (value: string) => {
    if (value !== goal.title) {
      updateLifeGoal.mutate({ id: goal.id, data: { title: value } });
    }
  };

  const handleDescriptionSave = (value: string) => {
    const newDesc = value.trim() || null;
    if (newDesc !== goal.description) {
      updateLifeGoal.mutate({ id: goal.id, data: { description: newDesc } });
    }
  };

  const handleDelete = () => {
    deleteLifeGoal.mutate(goal.id);
  };

  return (
    <motion.div
      layout
      className="py-2 border-b last:border-0 px-1 rounded-sm transition-colors duration-200 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2">
        <span className={cn("text-xs text-muted-foreground w-4 mt-0.5 shrink-0", accentColor)}>
          {goal.position}.
        </span>
        <div className="flex-1 min-w-0 space-y-0.5">
          <InlineEdit
            value={goal.title}
            onSave={handleTitleSave}
            placeholder="Введите цель..."
            className="text-sm font-medium w-full"
          />
          <InlineEdit
            value={goal.description ?? ""}
            onSave={handleDescriptionSave}
            placeholder="Добавить описание..."
            className="text-xs text-muted-foreground w-full"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 8 }}
          transition={{ duration: 0.15 }}
          className="shrink-0"
        >
          <ConfirmationDialog
            trigger={
              <button
                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Удалить цель"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            }
            title="Удалить цель?"
            description="Это действие нельзя отменить. Цель будет удалена навсегда."
            onConfirm={handleDelete}
            destructive
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
