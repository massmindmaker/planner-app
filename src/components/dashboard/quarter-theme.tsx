"use client";
import { motion } from "motion/react";
import { useQuarterThemes, useUpsertQuarterTheme } from "@/hooks/use-quarter-themes";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { InlineEdit } from "@/components/shared/inline-edit";
import { Sparkles } from "lucide-react";

function getCurrentQuarter(): number {
  return Math.floor(new Date().getMonth() / 3) + 1;
}

export function QuarterTheme() {
  const year = new Date().getFullYear();
  const quarter = getCurrentQuarter();
  const { data, isLoading } = useQuarterThemes(year);
  const upsertTheme = useUpsertQuarterTheme();

  if (isLoading) return null;

  const theme = data?.find((t: any) => t.quarter === quarter);
  const title = theme?.title ?? "";

  const handleSave = (value: string) => {
    if (!value.trim()) return;
    upsertTheme.mutate(
      { year, quarter, title: value.trim(), description: theme?.description ?? "" },
      { onSuccess: () => toast.success("Тема обновлена") }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-violet-500/5">
        <CardContent className="py-3 px-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
            <span className="text-xs text-muted-foreground shrink-0">Q{quarter} {year} · Тема:</span>
            <InlineEdit
              value={title}
              onSave={handleSave}
              placeholder="Задай тему квартала"
              className="text-sm font-medium flex-1"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
