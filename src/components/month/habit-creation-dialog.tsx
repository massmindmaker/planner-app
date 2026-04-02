"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useCreateDailyHabit } from "@/hooks/use-daily-habits";
import { CURRENT_YEAR } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface HabitCreationDialogProps {
  month: number;
  habitCount: number;
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

type Polarity = "positive" | "negative";
type HabitType = "boolean" | "numeric" | "weekly_target";

export function HabitCreationDialog({ month, habitCount, externalOpen, onExternalOpenChange }: HabitCreationDialogProps) {
  const createHabit = useCreateDailyHabit();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onExternalOpenChange?.(v);
  };
  const [name, setName] = useState("");
  const [polarity, setPolarity] = useState<Polarity>("positive");
  const [habitType, setHabitType] = useState<HabitType>("boolean");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");
  const [timesPerWeek, setTimesPerWeek] = useState("");
  const [minVersion, setMinVersion] = useState("");
  const [goal, setGoal] = useState("");

  const reset = () => {
    setName("");
    setPolarity("positive");
    setHabitType("boolean");
    setTargetValue("");
    setUnit("");
    setTimesPerWeek("");
    setMinVersion("");
    setGoal("");
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    const payload: any = {
      month,
      year: CURRENT_YEAR,
      name: name.trim(),
      position: habitCount + 1,
      polarity,
      habitType,
    };

    if (habitType === "numeric") {
      if (targetValue) payload.targetValue = Number(targetValue);
      if (unit.trim()) payload.unit = unit.trim();
    }
    if (habitType === "weekly_target") {
      if (timesPerWeek) payload.targetValue = Number(timesPerWeek);
    }
    if (minVersion.trim()) payload.minVersion = minVersion.trim();
    if (goal) payload.goal = Number(goal);

    createHabit.mutate(payload, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  const isValid = name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger render={
        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="h-3 w-3" />
          Добавить привычку
        </Button>
      } />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Новая привычка</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Название</label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && isValid && handleSubmit()}
              placeholder="Название привычки..."
            />
          </div>

          {/* Polarity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Полярность</label>
            <div className="flex gap-2">
              {(["positive", "negative"] as Polarity[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPolarity(p)}
                  className={cn(
                    "flex-1 rounded-md border py-1.5 text-sm font-medium transition-colors",
                    polarity === p
                      ? p === "positive"
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-red-500 border-red-500 text-white"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-foreground/50"
                  )}
                >
                  {p === "positive" ? "Позитивная" : "Негативная"}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Тип</label>
            <div className="flex gap-2 flex-wrap">
              {(["boolean", "numeric", "weekly_target"] as HabitType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setHabitType(t)}
                  className={cn(
                    "flex-1 min-w-[90px] rounded-md border py-1.5 text-sm font-medium transition-colors",
                    habitType === t
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground hover:border-foreground/50"
                  )}
                >
                  {t === "boolean" ? "Да/Нет" : t === "numeric" ? "Числовой" : "Раз в неделю"}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional: Numeric */}
          <AnimatePresence mode="wait">
            {habitType === "numeric" && (
              <motion.div
                key="numeric"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2 overflow-hidden"
              >
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-medium">Цель</label>
                  <Input
                    type="number"
                    min={1}
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-medium">Единица</label>
                  <Input
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="мл, мин..."
                  />
                </div>
              </motion.div>
            )}

            {habitType === "weekly_target" && (
              <motion.div
                key="weekly"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5 overflow-hidden"
              >
                <label className="text-sm font-medium">Раз в неделю</label>
                <Input
                  type="number"
                  min={1}
                  max={7}
                  value={timesPerWeek}
                  onChange={(e) => setTimesPerWeek(e.target.value)}
                  placeholder="3"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Goal (monthly target completions) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Цель на месяц{" "}
              <span className="font-normal text-xs">(дней)</span>
            </label>
            <Input
              type="number"
              min={1}
              max={31}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="20"
            />
          </div>

          {/* Min version */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Минимум{" "}
              <span className="font-normal text-xs">(необязательно)</span>
            </label>
            <Input
              value={minVersion}
              onChange={(e) => setMinVersion(e.target.value)}
              placeholder="Хотя бы 5 мин..."
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Отмена
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || createHabit.isPending}
          >
            {createHabit.isPending ? "Сохранение..." : "Добавить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
