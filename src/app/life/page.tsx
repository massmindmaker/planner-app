"use client";
import { useLifeGoals } from "@/hooks/use-life-goals";
import { useCategories } from "@/hooks/use-goals";
import { LifeCategoryCard } from "@/components/life/life-category-card";
import { motion } from "motion/react";

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-l-4 border-l-muted overflow-hidden">
      <div className="p-4 pb-2">
        <div className="skeleton h-5 w-32 rounded" />
      </div>
      <div className="p-4 pt-2 space-y-2">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
      </div>
    </div>
  );
}

export default function LifePage() {
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: lifeGoals, isLoading: goalsLoading } = useLifeGoals();

  const isLoading = catLoading || goalsLoading;

  const allGoals = lifeGoals ?? [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-2xl font-bold">Моя миссия</h1>
        <p className="text-muted-foreground mt-1">
          «Жизнь без целей — это дорога без пункта назначения. Знай, куда идёшь.»
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(categories ?? []).map((cat: any, index: number) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.3 + index * 0.1,
                ease: "easeOut",
              }}
            >
              <LifeCategoryCard
                category={cat}
                goals={allGoals.filter((g: any) => g.categoryId === cat.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
