"use client";
import { motion } from "motion/react";

interface XpBarProps {
  currentXp: number;
  nextLevelXp: number;
  xpInLevel: number;
  xpForLevel: number;
}

export function XpBar({ currentXp, nextLevelXp, xpInLevel, xpForLevel }: XpBarProps) {
  const progress =
    xpForLevel > 0 ? Math.min(100, Math.round((xpInLevel / xpForLevel) * 100)) : 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium tabular-nums">
          {currentXp.toLocaleString("ru-RU")} / {nextLevelXp.toLocaleString("ru-RU")} XP
        </span>
        <span className="text-muted-foreground text-xs">{progress}%</span>
      </div>

      <div className="h-3 w-full rounded-full bg-muted overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}
