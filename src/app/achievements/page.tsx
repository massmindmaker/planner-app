"use client";
import { useAchievements } from "@/hooks/use-achievements";
import { useXp } from "@/hooks/use-xp";
import { getLevel } from "@/lib/xp";
import { AchievementCard } from "@/components/achievements/achievement-card";
import { XpBar } from "@/components/achievements/xp-bar";
import { LevelBadge } from "@/components/achievements/level-badge";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";

export default function AchievementsPage() {
  const { data: achievements, isLoading: achLoading } = useAchievements();
  const { data: xpData, isLoading: xpLoading } = useXp();

  const isLoading = achLoading || xpLoading;

  const levelInfo = xpData ? getLevel(xpData.totalXp ?? 0) : null;

  const allAchievements = achievements ?? [];
  const unlocked = allAchievements.filter((a: any) => a.unlocked);
  const locked = allAchievements.filter((a: any) => !a.unlocked);
  const sorted = [...unlocked, ...locked];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-violet-500" />
          <h1 className="text-2xl font-bold">Достижения</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Разблокируйте достижения, выполняя привычки и достигая целей.
        </p>
      </motion.div>

      {/* XP summary */}
      {isLoading ? (
        <SkeletonCard className="max-w-lg" />
      ) : levelInfo ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl border bg-card p-6 shadow-sm max-w-lg"
        >
          <div className="flex items-center gap-6">
            <LevelBadge level={levelInfo.level} title={levelInfo.title} />

            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Прогресс уровня</p>
                <XpBar
                  currentXp={xpData?.totalXp ?? 0}
                  nextLevelXp={levelInfo.nextLevel?.xpRequired ?? xpData?.totalXp ?? 0}
                  xpInLevel={levelInfo.xpInLevel}
                  xpForLevel={levelInfo.xpForLevel}
                />
              </div>
              {levelInfo.nextLevel && (
                <p className="text-xs text-muted-foreground">
                  До уровня «{levelInfo.nextLevel.title}»:{" "}
                  <span className="font-semibold text-violet-600 dark:text-violet-400">
                    {levelInfo.xpToNext.toLocaleString("ru-RU")} XP
                  </span>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Counter + grid */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Все достижения</h2>
            <span className="rounded-full bg-violet-100 dark:bg-violet-900/40 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
              {unlocked.length} из {allAchievements.length} разблокировано
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {sorted.map((achievement: any, index: number) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.3 + index * 0.06,
                  ease: "easeOut",
                }}
              >
                <AchievementCard achievement={achievement} />
              </motion.div>
            ))}
          </div>

          {allAchievements.length === 0 && (
            <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
              Достижения пока не добавлены.
            </div>
          )}
        </motion.div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
