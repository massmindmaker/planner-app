"use client";
import { useCategories, useGoals } from "@/hooks/use-goals";
import { CategoryCard } from "@/components/goals/category-card";

export default function GoalsPage() {
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: goals, isLoading: goalsLoading } = useGoals();

  if (catLoading || goalsLoading) {
    return <div className="text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Цели на год</h1>
        <p className="text-muted-foreground mt-1">
          «Если у тебя есть план на миллион, не спрашивай совета у тех, кто живёт на десять тысяч.»
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(categories ?? []).map((cat: any) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            goals={(goals ?? []).filter((g: any) => g.categoryId === cat.id)}
          />
        ))}
      </div>
    </div>
  );
}
