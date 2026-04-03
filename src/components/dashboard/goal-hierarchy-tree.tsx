"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Compass, Target, CheckSquare, Activity } from "lucide-react";
import { useLifeGoals } from "@/hooks/use-life-goals";
import { useGoals } from "@/hooks/use-goals";
import { useMonthFocus } from "@/hooks/use-month-focus";
import { useHabitTemplates } from "@/hooks/use-habit-templates";
import { cn } from "@/lib/utils";

interface TreeNodeProps {
  icon: React.ReactNode;
  label: string;
  level: number;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  color?: string;
}

function TreeNode({ icon, label, level, children, defaultOpen = false, color }: TreeNodeProps) {
  const [open, setOpen] = useState(defaultOpen);
  const hasChildren = !!children;

  return (
    <div className={cn("relative", level > 0 && "ml-4 border-l border-border/50 pl-3")}>
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className={cn(
          "flex items-center gap-2 py-1 text-sm w-full text-left rounded-md px-1 transition-colors",
          hasChildren && "hover:bg-muted/50 cursor-pointer",
          !hasChildren && "cursor-default text-muted-foreground"
        )}
      >
        {hasChildren && (
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </motion.div>
        )}
        {!hasChildren && <span className="w-3" />}
        <span className={cn("flex-shrink-0", color)}>{icon}</span>
        <span className="truncate">{label}</span>
      </button>
      <AnimatePresence>
        {open && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GoalHierarchyTree() {
  const { data: lifeGoals } = useLifeGoals();
  const { data: yearlyGoals } = useGoals();
  const currentMonth = new Date().getMonth() + 1;
  const { data: monthFocusItems } = useMonthFocus(currentMonth);
  const { data: templates } = useHabitTemplates();

  if (!lifeGoals?.length) return null;

  return (
    <div className="rounded-xl border p-4 space-y-1">
      <h3 className="text-sm font-semibold mb-3">Иерархия целей</h3>
      {lifeGoals.map((lg: any) => {
        const linkedYearGoals = (yearlyGoals ?? []).filter((yg: any) => yg.lifeGoalId === lg.id);
        return (
          <TreeNode
            key={lg.id}
            icon={<Compass className="h-3.5 w-3.5" />}
            label={lg.title}
            level={0}
            defaultOpen={true}
            color="text-violet-500"
          >
            {linkedYearGoals.map((yg: any) => {
              const linkedFocus = (monthFocusItems ?? []).filter((mf: any) => mf.goalId === yg.id);
              return (
                <TreeNode
                  key={yg.id}
                  icon={<Target className="h-3.5 w-3.5" />}
                  label={yg.title || "Без названия"}
                  level={1}
                  color="text-blue-500"
                >
                  {linkedFocus.map((mf: any) => (
                    <TreeNode
                      key={mf.id}
                      icon={<CheckSquare className="h-3.5 w-3.5" />}
                      label={mf.title}
                      level={2}
                      color={mf.completed ? "text-green-500" : "text-amber-500"}
                    />
                  ))}
                </TreeNode>
              );
            })}
          </TreeNode>
        );
      })}
    </div>
  );
}
