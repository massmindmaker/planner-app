"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalRow } from "./goal-row";
import { useCreateGoal } from "@/hooks/use-goals";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Briefcase, Wallet, Palette, BookOpen, Heart, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const ICONS: Record<string, any> = {
  briefcase: Briefcase,
  wallet: Wallet,
  palette: Palette,
  "book-open": BookOpen,
  heart: Heart,
  sparkles: Sparkles,
};

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; light: string }> = {
  "Карьера": { bg: "bg-blue-500", border: "border-l-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  "Финансы": { bg: "bg-emerald-500", border: "border-l-emerald-500", text: "text-emerald-600", light: "bg-emerald-50" },
  "Творчество": { bg: "bg-violet-500", border: "border-l-violet-500", text: "text-violet-600", light: "bg-violet-50" },
  "Личное развитие": { bg: "bg-amber-500", border: "border-l-amber-500", text: "text-amber-600", light: "bg-amber-50" },
  "Взаимоотношения": { bg: "bg-rose-500", border: "border-l-rose-500", text: "text-rose-600", light: "bg-rose-50" },
  "Духовность": { bg: "bg-purple-500", border: "border-l-purple-500", text: "text-purple-600", light: "bg-purple-50" },
};

const DEFAULT_COLOR = { bg: "bg-gray-500", border: "border-l-gray-500", text: "text-gray-600", light: "bg-gray-50" };

interface CategoryCardProps {
  category: { id: number; name: string; icon: string };
  goals: any[];
}

export function CategoryCard({ category, goals }: CategoryCardProps) {
  const createGoal = useCreateGoal();
  const Icon = ICONS[category.icon] ?? Briefcase;
  const completed = goals.filter((g) => g.completed).length;
  const colors = CATEGORY_COLORS[category.name] ?? DEFAULT_COLOR;
  const progressPercent = goals.length > 0 ? (completed / goals.length) * 100 : 0;

  const handleAdd = () => {
    const nextPosition = goals.length + 1;
    if (nextPosition > 8) return;
    createGoal.mutate({
      categoryId: category.id,
      position: nextPosition,
      title: "",
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={`border-l-4 ${colors.border} hover:shadow-lg transition-shadow duration-300 overflow-hidden`}>
        <CardHeader className={`pb-2 ${colors.light}`}>
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className={`h-5 w-5 ${colors.text}`} />
            {category.name}
            <span className="ml-auto text-xs text-muted-foreground font-normal">
              {completed}/{goals.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 pb-3">
          <AnimatePresence initial={false}>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <GoalRow goal={goal} accentColor={colors.text} />
              </motion.div>
            ))}
          </AnimatePresence>

          {goals.length < 8 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAdd}
                className="w-full mt-2 text-muted-foreground hover:text-foreground group"
              >
                <motion.span
                  className="inline-flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-3 w-3 mr-1 transition-transform group-hover:rotate-90 duration-200" />
                  Добавить цель
                </motion.span>
              </Button>
            </motion.div>
          )}

          {/* Mini progress bar */}
          {goals.length > 0 && (
            <div className="mt-3 pt-2 border-t">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${colors.bg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
