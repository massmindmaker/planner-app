"use client";
import { motion } from "motion/react";
import { useXp } from "@/hooks/use-xp";
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";

export function XpSummary() {
  const { data, isLoading } = useXp();

  if (isLoading || !data) {
    return (
      <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-amber-500/5">
        <CardContent className="p-4">
          <div className="h-12 animate-pulse bg-muted/30 rounded" />
        </CardContent>
      </Card>
    );
  }

  const { level, title, totalXp, xpToNext, xpInLevel, xpForLevel } = data;
  const progress = xpForLevel > 0 ? Math.min((xpInLevel / xpForLevel) * 100, 100) : 100;

  return (
    <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-amber-500/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-500/20 shrink-0">
            <Zap className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold leading-none">Ур. {level}</span>
              <span className="text-xs text-muted-foreground truncate">{title}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{totalXp} XP</p>
          </div>
        </div>
        <div className="relative h-1.5 bg-muted/40 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-yellow-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          />
        </div>
        {xpToNext > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{xpToNext} XP до следующего уровня</p>
        )}
      </CardContent>
    </Card>
  );
}
