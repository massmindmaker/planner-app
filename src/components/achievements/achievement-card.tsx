"use client";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  // Convert kebab-case to PascalCase for Lucide icon name lookup
  const pascalCase = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

  const Icon = (LucideIcons as Record<string, any>)[pascalCase];
  if (!Icon) {
    const Fallback = (LucideIcons as Record<string, any>)["Trophy"];
    return Fallback ? <Fallback className={className} /> : null;
  }
  return <Icon className={className} />;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { name, description, icon, xpReward, unlocked, unlockedAt } = achievement;

  const formattedDate =
    unlockedAt
      ? new Date(unlockedAt).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={`relative overflow-hidden transition-shadow duration-300 hover:shadow-lg ${
          unlocked
            ? "border-violet-200 dark:border-violet-800"
            : "border-muted opacity-70"
        }`}
      >
        <CardContent className="p-4 flex flex-col gap-3">
          {/* Icon area */}
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                unlocked
                  ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-md"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {unlocked ? (
                <DynamicIcon name={icon} className="h-5 w-5" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <DynamicIcon name={icon} className="h-5 w-5 opacity-40" />
                  <Lock className="absolute -bottom-1 -right-1 h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-sm leading-snug ${
                  unlocked ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-2">
            <span
              className={`text-xs font-medium ${
                unlocked ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground"
              }`}
            >
              +{xpReward} XP
            </span>
            {unlocked && formattedDate ? (
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            ) : (
              <span className="text-xs text-muted-foreground italic">Заблокировано</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
