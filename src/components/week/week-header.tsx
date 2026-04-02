"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfISOWeek, endOfISOWeek, setISOWeek, setYear } from "date-fns";
import { ru } from "date-fns/locale";
import {
  useWeeklyPlan,
  useCreateWeeklyPlan,
  useUpdateWeeklyPlan,
} from "@/hooks/use-weekly-plans";
import { CURRENT_YEAR } from "@/lib/utils";

interface WeekHeaderProps {
  week: number;
  year?: number;
}

function getWeekDateRange(week: number, year: number): { start: Date; end: Date } {
  const jan4 = new Date(year, 0, 4);
  const startOfFirstWeek = startOfISOWeek(jan4);
  const weekDate = setYear(setISOWeek(new Date(), week), year);
  return {
    start: startOfISOWeek(weekDate),
    end: endOfISOWeek(weekDate),
  };
}

export function WeekHeader({ week, year = CURRENT_YEAR }: WeekHeaderProps) {
  const { data: plan } = useWeeklyPlan(week, year);
  const create = useCreateWeeklyPlan();
  const update = useUpdateWeeklyPlan();

  const [editing, setEditing] = useState(false);
  const [focusValue, setFocusValue] = useState("");

  const planId = plan?.id as number | undefined;
  const savedFocus = (plan?.focus_text ?? plan?.theme ?? "") as string;

  const prevWeek = week > 1 ? week - 1 : 52;
  const nextWeek = week < 53 ? week + 1 : 1;

  const { start, end } = getWeekDateRange(week, year);
  const dateRange = `${format(start, "d MMM", { locale: ru })} – ${format(end, "d MMM yyyy", { locale: ru })}`;

  const commitFocus = () => {
    const trimmed = focusValue.trim();
    setEditing(false);
    if (trimmed === savedFocus) return;
    const payload = { focus_text: trimmed, theme: trimmed };
    if (planId) {
      update.mutate({ id: planId, data: payload });
    } else {
      create.mutate({ week, year, ...payload });
    }
  };

  const startEditing = () => {
    setFocusValue(savedFocus);
    setEditing(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href={`/week/${prevWeek}`}>
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </motion.div>
        </Link>

        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 bg-clip-text text-transparent">
            Неделя {week}
          </h1>
          <p className="text-sm text-muted-foreground">{dateRange}</p>
        </div>

        <Link href={`/week/${nextWeek}`}>
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </Link>
      </div>

      {/* Фокус недели */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
            Фокус недели
          </p>
          {editing ? (
            <input
              autoFocus
              value={focusValue}
              onChange={(e) => setFocusValue(e.target.value)}
              onBlur={commitFocus}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitFocus();
                if (e.key === "Escape") {
                  setFocusValue(savedFocus);
                  setEditing(false);
                }
              }}
              placeholder="Введите фокус недели..."
              className="w-full text-sm bg-transparent border-b border-primary outline-none py-0.5"
            />
          ) : (
            <p
              onDoubleClick={startEditing}
              onClick={startEditing}
              className="text-sm cursor-text min-h-[1.5rem] text-foreground/80 hover:text-foreground transition-colors"
            >
              {savedFocus || (
                <span className="text-muted-foreground italic">
                  Нажмите, чтобы добавить фокус недели...
                </span>
              )}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
