"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalRow } from "./goal-row";
import { useCreateGoal } from "@/hooks/use-goals";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Briefcase, Wallet, Palette, BookOpen, Heart, Sparkles,
} from "lucide-react";

const ICONS: Record<string, any> = {
  briefcase: Briefcase,
  wallet: Wallet,
  palette: Palette,
  "book-open": BookOpen,
  heart: Heart,
  sparkles: Sparkles,
};

interface CategoryCardProps {
  category: { id: number; name: string; icon: string };
  goals: any[];
}

export function CategoryCard({ category, goals }: CategoryCardProps) {
  const createGoal = useCreateGoal();
  const Icon = ICONS[category.icon] ?? Briefcase;
  const completed = goals.filter((g) => g.completed).length;

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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-5 w-5" />
          {category.name}
          <span className="ml-auto text-xs text-muted-foreground font-normal">
            {completed}/{goals.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {goals.map((goal) => (
          <GoalRow key={goal.id} goal={goal} />
        ))}
        {goals.length < 8 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAdd}
            className="w-full mt-2 text-muted-foreground"
          >
            <Plus className="h-3 w-3 mr-1" />
            Добавить цель
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
