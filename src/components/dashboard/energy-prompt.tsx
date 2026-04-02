"use client";
import { motion, AnimatePresence } from "motion/react";
import { useEnergy, useUpsertEnergy } from "@/hooks/use-energy";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import * as api from "@/lib/api";
import { XP_VALUES } from "@/lib/xp";

const ENERGY_EMOJIS = [
  { level: 1, emoji: "😴", label: "Истощён" },
  { level: 2, emoji: "😐", label: "Устал" },
  { level: 3, emoji: "🙂", label: "Нормально" },
  { level: 4, emoji: "😊", label: "Хорошо" },
  { level: 5, emoji: "🔥", label: "Отлично" },
];

interface EnergyPromptProps {
  date: string;
}

export function EnergyPrompt({ date }: EnergyPromptProps) {
  const { data, isLoading } = useEnergy(date);
  const upsertEnergy = useUpsertEnergy();
  const [selected, setSelected] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || dismissed) return null;
  if (data?.level) return null;

  const handleSelect = async (level: number) => {
    setSelected(level);
    try {
      await upsertEnergy.mutateAsync({ date, level });
      await api.awardXp({ date, xpGained: XP_VALUES.energy_log, source: "energy_log" });
    } finally {
      setTimeout(() => setDismissed(true), 600);
    }
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-amber-500/5">
            <CardContent className="py-4 px-5">
              <p className="text-sm font-medium mb-3">Как твоя энергия сегодня?</p>
              <div className="flex gap-2">
                {ENERGY_EMOJIS.map(({ level, emoji, label }) => (
                  <motion.button
                    key={level}
                    onClick={() => handleSelect(level)}
                    disabled={upsertEnergy.isPending || selected !== null}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    animate={selected === level ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
                    title={label}
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs text-muted-foreground">{level}</span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
