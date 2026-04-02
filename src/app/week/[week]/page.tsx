"use client";
import { use, useMemo } from "react";
import { redirect } from "next/navigation";
import { motion } from "motion/react";
import { format, startOfISOWeek, endOfISOWeek, setISOWeek, eachDayOfInterval, getISOWeek } from "date-fns";
import { ru } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { WeekHeader } from "@/components/week/week-header";
import { WeekHabitsSummary } from "@/components/week/week-habits-summary";
import { ReviewForm } from "@/components/week/review-form";
import { useEnergy } from "@/hooks/use-energy";
import { CURRENT_YEAR } from "@/lib/utils";

// Energy emoji mapping
const ENERGY_EMOJI: Record<number, string> = {
  1: "😴",
  2: "😔",
  3: "😐",
  4: "😊",
  5: "⚡",
};

const ENERGY_LABEL: Record<number, string> = {
  1: "Истощён",
  2: "Низкий",
  3: "Средний",
  4: "Хороший",
  5: "Отличный",
};

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function getWeekDates(week: number, year: number): Date[] {
  const ref = setISOWeek(new Date(year, 0, 4), week);
  ref.setFullYear(year);
  const start = startOfISOWeek(ref);
  const end = endOfISOWeek(ref);
  return eachDayOfInterval({ start, end });
}

function DayEnergyCell({ date }: { date: Date }) {
  const dateStr = format(date, "yyyy-MM-dd");
  const { data } = useEnergy(dateStr);
  const level = data?.level as number | undefined;

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xl">{level ? ENERGY_EMOJI[level] : "○"}</span>
      {level && (
        <span className="text-[10px] text-muted-foreground">{ENERGY_LABEL[level]}</span>
      )}
    </div>
  );
}

function WeekEnergyStrip({ week, year }: { week: number; year: number }) {
  const dates = useMemo(() => getWeekDates(week, year), [week, year]);

  return (
    <Card className="rounded-xl">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
          Энергия по дням
        </p>
        <div className="grid grid-cols-7 gap-2">
          {dates.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{DAY_LABELS[i]}</span>
              <span className="text-xs text-muted-foreground/70">
                {format(d, "d", { locale: ru })}
              </span>
              <DayEnergyCell date={d} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const WEEK_QUOTES: Record<number, string> = {
  1: "Первая неделя года задаёт тон. Начни сильно.",
  13: "Первая неделя второго квартала. Переосмысли цели.",
  26: "Середина года. Оцени прогресс и скорректируй курс.",
  39: "Четвёртый квартал начинается. Финишная прямая.",
  52: "Последняя неделя года. Заверши достойно.",
};

function getWeekQuote(week: number): string {
  if (week <= 2) return WEEK_QUOTES[1];
  if (week <= 13) return "Каждый день — шаг к цели. Не останавливайся.";
  if (week <= 26) return "Последовательность важнее интенсивности.";
  if (week <= 39) return "Половина года позади. Удвой усилия.";
  return "Конец года близко. Каждая неделя на счету.";
}

export default function WeekPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week: weekStr } = use(params);
  const week = Number(weekStr);

  if (isNaN(week) || week < 1 || week > 53) {
    redirect("/");
  }

  const currentWeek = getISOWeek(new Date());
  const isCurrentWeek = week === currentWeek;

  return (
    <motion.div
      key={week}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with week number, date range, nav, focus */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <WeekHeader week={week} year={CURRENT_YEAR} />
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <p className="text-sm text-muted-foreground italic text-center">
          {isCurrentWeek ? "Это текущая неделя. " : ""}
          {getWeekQuote(week)}
        </p>
      </motion.div>

      {/* Energy strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <WeekEnergyStrip week={week} year={CURRENT_YEAR} />
      </motion.div>

      {/* Habits summary table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
      >
        <WeekHabitsSummary week={week} year={CURRENT_YEAR} />
      </motion.div>

      {/* Review form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
      >
        <ReviewForm type="weekly" year={CURRENT_YEAR} week={week} />
      </motion.div>
    </motion.div>
  );
}
