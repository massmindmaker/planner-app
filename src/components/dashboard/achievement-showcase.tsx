"use client";
import { motion } from "motion/react";
import { useAchievements } from "@/hooks/use-achievements";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export function AchievementShowcase() {
  const { data, isLoading } = useAchievements();

  const recent = (data as Achievement[] | undefined)
    ?.filter((a) => a.unlocked)
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
    })
    .slice(0, 3);

  if (isLoading) return null;
  if (!recent || recent.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Достижения</h3>
          <Link
            href="/achievements"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Все достижения →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="flex flex-wrap gap-2">
          {recent.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
              title={a.description}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium"
            >
              <span className="text-base leading-none">{a.icon}</span>
              <span>{a.name}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
