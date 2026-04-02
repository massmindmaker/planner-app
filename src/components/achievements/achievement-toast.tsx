"use client";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import confetti from "canvas-confetti";

interface Achievement {
  name: string;
  icon: string;
  xpReward: number;
}

function getDynamicIcon(name: string) {
  const pascalCase = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return (
    (LucideIcons as Record<string, any>)[pascalCase] ??
    (LucideIcons as Record<string, any>)["Trophy"]
  );
}

export function showAchievementToast(achievement: Achievement) {
  const Icon = getDynamicIcon(achievement.icon);

  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#FFD700', '#FFA500', '#FF6347'] });

  toast.custom((id) => (
    <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-white px-4 py-3 shadow-xl dark:border-violet-800 dark:bg-zinc-900 min-w-[280px]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
          Достижение разблокировано!
        </p>
        <p className="text-sm font-bold text-foreground truncate">{achievement.name}</p>
        <p className="text-xs text-muted-foreground">+{achievement.xpReward} XP</p>
      </div>
    </div>
  ));
}
