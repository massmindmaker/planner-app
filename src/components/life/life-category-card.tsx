"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Wallet, Palette, BookOpen, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LifeGoalRow } from "./life-goal-row";
import { useCreateLifeGoal } from "@/hooks/use-life-goals";

const ICONS: Record<string, any> = {
  briefcase: Briefcase,
  wallet: Wallet,
  palette: Palette,
  "book-open": BookOpen,
  heart: Heart,
  sparkles: Sparkles,
};

const CATEGORY_COLORS: Record<string, {
  bg: string;
  border: string;
  text: string;
  gradient: string;
}> = {
  "Карьера":           { bg: "bg-blue-500",    border: "border-l-blue-500",    text: "text-blue-600",    gradient: "card-gradient-career" },
  "Финансы":           { bg: "bg-emerald-500", border: "border-l-emerald-500", text: "text-emerald-600", gradient: "card-gradient-finance" },
  "Творчество":        { bg: "bg-violet-500",  border: "border-l-violet-500",  text: "text-violet-600",  gradient: "card-gradient-creativity" },
  "Личное развитие":   { bg: "bg-amber-500",   border: "border-l-amber-500",   text: "text-amber-600",   gradient: "card-gradient-personal" },
  "Взаимоотношения":   { bg: "bg-rose-500",    border: "border-l-rose-500",    text: "text-rose-600",    gradient: "card-gradient-relationships" },
  "Духовность":        { bg: "bg-purple-500",  border: "border-l-purple-500",  text: "text-purple-600",  gradient: "card-gradient-spirituality" },
};

const DEFAULT_COLOR = {
  bg: "bg-gray-500",
  border: "border-l-gray-500",
  text: "text-gray-600",
  gradient: "card-gradient",
};

interface LifeCategoryCardProps {
  category: { id: number; name: string; icon: string };
  goals: any[];
}

export function LifeCategoryCard({ category, goals }: LifeCategoryCardProps) {
  const createLifeGoal = useCreateLifeGoal();
  const Icon = ICONS[category.icon] ?? Briefcase;
  const colors = CATEGORY_COLORS[category.name] ?? DEFAULT_COLOR;

  const handleAdd = () => {
    createLifeGoal.mutate({
      categoryId: category.id,
      title: "",
      position: goals.length + 1,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={`border-l-4 ${colors.border} hover:shadow-lg transition-shadow duration-300 overflow-hidden`}>
        <CardHeader className={`pb-2 ${colors.gradient}`}>
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className={`h-5 w-5 ${colors.text}`} />
            {category.name}
            <span className="ml-auto text-xs text-muted-foreground font-normal">
              {goals.length}{" "}
              {goals.length === 1 ? "цель" : goals.length >= 2 && goals.length <= 4 ? "цели" : "целей"}
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
                <LifeGoalRow goal={goal} accentColor={colors.text} />
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAdd}
              disabled={createLifeGoal.isPending}
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
