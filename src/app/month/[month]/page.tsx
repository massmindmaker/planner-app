"use client";
import { use, useState } from "react";
import { redirect } from "next/navigation";
import { motion } from "motion/react";
import { MonthHeader } from "@/components/month/month-header";
import { MonthFocus } from "@/components/month/month-focus";
import { DailyHabitsTable } from "@/components/month/daily-habits-table";
import { WeeklyHabitsTable } from "@/components/month/weekly-habits-table";
import { KeyboardShortcutsModal } from "@/components/month/keyboard-shortcuts-modal";
import { useHabitKeyboard } from "@/hooks/use-habit-keyboard";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

const MONTH_QUOTES: Record<number, string> = {
  1: "Новый год -- новые привычки. Начни с малого, но начни сейчас.",
  2: "Февраль короток, но каждый день на счету.",
  3: "Весна -- время перемен. Расти вместе со своими привычками.",
  4: "Апрель -- месяц обновления. Продолжай двигаться вперёд.",
  5: "Май цветёт для тех, кто не сдаётся.",
  6: "Полгода позади. Оцени прогресс и удвой усилия.",
  7: "Лето -- не повод расслабляться. Дисциплина не берёт отпуск.",
  8: "Август -- время собирать плоды привычек, посеянных весной.",
  9: "Сентябрь -- второй январь. Обнови свои цели.",
  10: "Октябрь: осень учит отпускать лишнее и сохранять главное.",
  11: "Ноябрь -- финишная прямая. Не останавливайся.",
  12: "Декабрь: заверши год сильным. Ты уже столько прошёл.",
};

export default function MonthPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month: monthStr } = use(params);
  const month = Number(monthStr);

  const [habitCreationOpen, setHabitCreationOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useHabitKeyboard({
    onNewHabit: () => setHabitCreationOpen(true),
    onToggleHelp: () => setShortcutsOpen((prev) => !prev),
  });

  if (isNaN(month) || month < 1 || month > 12) {
    redirect("/");
  }

  return (
    <motion.div
      key={month}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <MonthHeader month={month} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      >
        <p className="text-sm text-muted-foreground italic text-center">
          {MONTH_QUOTES[month]}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      >
        <MonthFocus month={month} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
      >
        <DailyHabitsTable
          month={month}
          habitCreationOpen={habitCreationOpen}
          onHabitCreationOpenChange={setHabitCreationOpen}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
      >
        <WeeklyHabitsTable month={month} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.75 }}
        className="flex justify-center pt-2"
      >
        <Button variant="outline" className="gap-2" disabled>
          <ClipboardList className="h-4 w-4" />
          Итоги месяца
        </Button>
      </motion.div>

      <KeyboardShortcutsModal
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </motion.div>
  );
}
