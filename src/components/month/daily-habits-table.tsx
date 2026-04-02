"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HabitCheckbox } from "./habit-checkbox";
import { HabitContextMenu } from "./habit-context-menu";
import { NumericPopover } from "./numeric-popover";
import { HabitCreationDialog } from "./habit-creation-dialog";
import { useDailyHabits, useDeleteDailyHabit, useToggleDailyEntry, useUpdateDailyHabit } from "@/hooks/use-daily-habits";
import { useStreaks } from "@/hooks/use-streaks";
import { getDaysInMonth, getDayOfWeek, getWeekNumber, CURRENT_YEAR } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DailyHabitsTableProps {
  month: number;
  habitCreationOpen?: boolean;
  onHabitCreationOpenChange?: (open: boolean) => void;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value;
    const duration = 0.6;

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <>{display}</>;
}

function isToday(year: number, month: number, day: number): boolean {
  const now = new Date();
  return now.getFullYear() === year && now.getMonth() + 1 === month && now.getDate() === day;
}

function isWeekend(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month - 1, day).getDay();
  return dow === 0 || dow === 6;
}

/** Streak badge for habit rows */
function StreakBadge({ streak, polarity }: { streak: number; polarity?: string }) {
  if (!streak || streak <= 0) return null;
  const isNegative = polarity === "negative";
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 rounded px-1 py-0 text-[9px] font-semibold leading-tight shrink-0",
      isNegative
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
    )}>
      {isNegative ? "✓" : "🔥"}{streak}{isNegative ? "д" : ""}
    </span>
  );
}

/** Inline polarity badge — no external badge component needed */
function PolarityBadge({ polarity }: { polarity?: string }) {
  if (!polarity || polarity === "positive") return null;
  return (
    <span className="inline-flex items-center rounded px-1 py-0 text-[9px] font-semibold leading-tight bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 shrink-0">
      −
    </span>
  );
}

interface SortableHabitRowProps {
  habit: any;
  days: number;
  month: number;
  idx: number;
  streak: number;
  isChecked: (habitId: number, day: number) => boolean;
  isEntryMinimum: (habitId: number, day: number) => boolean;
  getEntryValue: (habitId: number, day: number) => number | null;
  handleToggle: (habitId: number, day: number, checked: boolean) => void;
  onNumericSave: (habitId: number, day: number, val: number, autoCompleted: boolean) => void;
  onContextToggle: (habitId: number, day: number, completed: boolean, isMinimum: boolean) => void;
  getTotal: (habitId: number) => number;
  onDelete: (id: number) => void;
}

function SortableHabitRow({
  habit,
  days,
  month,
  idx,
  streak,
  isChecked,
  isEntryMinimum,
  getEntryValue,
  handleToggle,
  onNumericSave,
  onContextToggle,
  getTotal,
  onDelete,
}: SortableHabitRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : ("auto" as any),
  };

  const isNegative = habit.polarity === "negative";

  const dateStr = (day: number) =>
    `${CURRENT_YEAR}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <motion.tr
      ref={setNodeRef}
      style={style}
      className="border-t group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      layout
    >
      <td className="p-1 sticky left-0 bg-card z-10">
        <motion.div
          className="flex items-center gap-1"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
        >
          <button
            className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground shrink-0 touch-none"
            {...attributes}
            {...listeners}
            tabIndex={-1}
            aria-label="Перетащить для изменения порядка"
          >
            <GripVertical className="h-3 w-3" />
          </button>
          <PolarityBadge polarity={habit.polarity} />
          <span className={cn(
            "truncate cursor-default hover:text-primary transition-colors",
            isNegative && "text-red-600/80 dark:text-red-400/80"
          )}>
            {habit.name}
          </span>
          <StreakBadge streak={streak} polarity={habit.polarity} />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(habit.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </motion.div>
        </motion.div>
      </td>
      {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
        const weekNum = getWeekNumber(CURRENT_YEAR, month, d);
        const prevWeek = d > 1 ? getWeekNumber(CURRENT_YEAR, month, d - 1) : 0;
        const weekend = isWeekend(CURRENT_YEAR, month, d);
        const isNumeric = habit.habitType === "numeric";
        const hasMinVersion = !!habit.minVersion;
        const checked = isChecked(habit.id, d);
        const entryIsMinimum = isEntryMinimum(habit.id, d);
        return (
          <td
            key={d}
            className={cn(
              "p-1 text-center",
              weekNum !== prevWeek && d > 1 && "border-l-2 border-muted-foreground/20",
              weekend && "bg-muted/40"
            )}
          >
            {isNumeric ? (
              <NumericPopover
                value={getEntryValue(habit.id, d)}
                completed={checked}
                targetValue={habit.targetValue}
                unit={habit.unit}
                isNegative={isNegative}
                onSave={(val, autoCompleted) => {
                  onNumericSave(habit.id, d, val, autoCompleted);
                }}
              />
            ) : hasMinVersion ? (
              <HabitContextMenu
                hasMinVersion={hasMinVersion}
                onComplete={() =>
                  onContextToggle(habit.id, d, true, false)
                }
                onMinimum={() =>
                  onContextToggle(habit.id, d, true, true)
                }
                onClear={() =>
                  onContextToggle(habit.id, d, false, false)
                }
              >
                <HabitCheckbox
                  checked={checked}
                  onToggle={(c) => handleToggle(habit.id, d, c)}
                  isNegative={isNegative}
                  isMinimum={entryIsMinimum}
                />
              </HabitContextMenu>
            ) : (
              <HabitCheckbox
                checked={checked}
                onToggle={(c) => handleToggle(habit.id, d, c)}
                isNegative={isNegative}
              />
            )}
          </td>
        );
      })}
      <td className="p-1 text-center text-muted-foreground">{habit.goal ?? "\u2014"}</td>
      <td className={cn(
        "p-1 text-center font-medium",
        isNegative && "text-red-500"
      )}>
        <AnimatedNumber value={getTotal(habit.id)} />
      </td>
    </motion.tr>
  );
}

export function DailyHabitsTable({ month, habitCreationOpen, onHabitCreationOpenChange }: DailyHabitsTableProps) {
  const { data, isLoading } = useDailyHabits(month);
  const deleteHabit = useDeleteDailyHabit();
  const toggleEntry = useToggleDailyEntry();
  const updateHabit = useUpdateDailyHabit();
  const { data: streaksData } = useStreaks();
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const deleteTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const [localOrder, setLocalOrder] = useState<number[] | null>(null);

  const days = getDaysInMonth(CURRENT_YEAR, month);
  const rawHabits = data?.habits ?? [];
  const habits = rawHabits.filter((h: any) => !deletedIds.includes(h.id));
  const entries = data?.entries ?? [];

  // Ordered habits — use local override after drag, fallback to server order
  const orderedHabits = localOrder
    ? localOrder
        .map((id) => habits.find((h: any) => h.id === id))
        .filter(Boolean)
    : habits;

  // Reset local order when fresh server data arrives
  useEffect(() => {
    setLocalOrder(null);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const currentIds = orderedHabits.map((h: any) => h.id);
      const oldIndex = currentIds.indexOf(active.id as number);
      const newIndex = currentIds.indexOf(over.id as number);
      if (oldIndex === -1 || newIndex === -1) return;

      const newIds = arrayMove(currentIds, oldIndex, newIndex) as number[];
      setLocalOrder(newIds);

      // Persist positions — fire-and-forget individual PATCHes
      newIds.forEach((id, index) => {
        updateHabit.mutate({ id, data: { position: index + 1 } });
      });
    },
    [orderedHabits, updateHabit]
  );

  const dateStr = (day: number) =>
    `${CURRENT_YEAR}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const getEntry = (habitId: number, day: number) =>
    entries.find((e: any) => e.habitId === habitId && e.date === dateStr(day));

  const isChecked = (habitId: number, day: number) => {
    const entry = getEntry(habitId, day);
    return entry?.completed ?? false;
  };

  const isEntryMinimum = (habitId: number, day: number) => {
    const entry = getEntry(habitId, day);
    return entry?.isMinimum ?? false;
  };

  const getEntryValue = (habitId: number, day: number): number | null => {
    const entry = getEntry(habitId, day);
    return entry?.value ?? null;
  };

  const handleToggle = (habitId: number, day: number, checked: boolean) => {
    toggleEntry.mutate({ id: habitId, date: dateStr(day), completed: checked });
  };

  const handleNumericSave = (habitId: number, day: number, val: number, autoCompleted: boolean) => {
    toggleEntry.mutate({
      id: habitId,
      date: dateStr(day),
      completed: autoCompleted,
      value: val,
    });
  };

  const handleContextToggle = (habitId: number, day: number, completed: boolean, isMinimum: boolean) => {
    toggleEntry.mutate({
      id: habitId,
      date: dateStr(day),
      completed,
      isMinimum,
    });
  };

  const getTotal = (habitId: number) =>
    entries.filter((e: any) => e.habitId === habitId && e.completed).length;

  const getDayProgress = (day: number) => {
    if (orderedHabits.length === 0) return 0;
    const checked = orderedHabits.filter((h: any) => isChecked(h.id, day)).length;
    return Math.round((checked / orderedHabits.length) * 100);
  };

  const handleDelete = (id: number) => {
    setDeletedIds((prev) => [...prev, id]);
    setLocalOrder((prev) => prev ? prev.filter((x) => x !== id) : null);
    toast("Удалено", {
      action: {
        label: "Отменить",
        onClick: () => {
          clearTimeout(deleteTimers.current.get(id));
          deleteTimers.current.delete(id);
          setDeletedIds((prev) => prev.filter((d) => d !== id));
        },
      },
      duration: 5000,
    });
    const timer = setTimeout(() => {
      deleteHabit.mutate(id);
      deleteTimers.current.delete(id);
      setDeletedIds((prev) => prev.filter((d) => d !== id));
    }, 5000);
    deleteTimers.current.set(id, timer);
  };

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Ежедневные привычки</CardTitle>
          <HabitCreationDialog
            month={month}
            habitCount={habits.length}
            externalOpen={habitCreationOpen}
            onExternalOpenChange={onHabitCreationOpenChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="habit-table-scroll">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left p-1 min-w-[140px] sticky left-0 bg-card z-10">Привычка</th>
                  {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                    const weekNum = getWeekNumber(CURRENT_YEAR, month, d);
                    const prevWeek = d > 1 ? getWeekNumber(CURRENT_YEAR, month, d - 1) : 0;
                    const today = isToday(CURRENT_YEAR, month, d);
                    const weekend = isWeekend(CURRENT_YEAR, month, d);
                    return (
                      <th
                        key={d}
                        className={cn(
                          "p-1 text-center min-w-[28px]",
                          weekNum !== prevWeek && d > 1 && "border-l-2 border-muted-foreground/20",
                          weekend && "bg-muted/40"
                        )}
                      >
                        <div className={cn("flex flex-col items-center", today && "relative")}>
                          <span>{getDayOfWeek(CURRENT_YEAR, month, d)}</span>
                          {today ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                              {d}
                            </span>
                          ) : (
                            <span className="font-normal text-muted-foreground">{d}</span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                  <th className="p-1 text-center min-w-[40px]">Цель</th>
                  <th className="p-1 text-center min-w-[40px]">Итого</th>
                </tr>
              </thead>
              <tbody>
                <SortableContext
                  items={orderedHabits.map((h: any) => h.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence mode="popLayout">
                    {orderedHabits.map((habit: any, idx: number) => {
                      const habitStreak = streaksData?.find((s: any) => s.templateId === habit.templateId)?.streak ?? 0;
                      return (
                        <SortableHabitRow
                          key={habit.id}
                          habit={habit}
                          days={days}
                          month={month}
                          idx={idx}
                          streak={habitStreak}
                          isChecked={isChecked}
                          isEntryMinimum={isEntryMinimum}
                          getEntryValue={getEntryValue}
                          handleToggle={handleToggle}
                          onNumericSave={handleNumericSave}
                          onContextToggle={handleContextToggle}
                          getTotal={getTotal}
                          onDelete={handleDelete}
                        />
                      );
                    })}
                  </AnimatePresence>
                </SortableContext>
                {/* Progress row */}
                <motion.tr
                  className="border-t-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: orderedHabits.length * 0.05 + 0.1 }}
                >
                  <td className="p-1 text-muted-foreground sticky left-0 bg-card z-10">Прогресс</td>
                  {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                    const pct = getDayProgress(d);
                    const weekend = isWeekend(CURRENT_YEAR, month, d);
                    return (
                      <td key={d} className={cn("p-1 text-center", weekend && "bg-muted/40")}>
                        {orderedHabits.length > 0 && (
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="font-mono text-[10px] text-muted-foreground">{pct}%</span>
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background: `linear-gradient(90deg, rgb(239 68 68), rgb(234 179 8), rgb(34 197 94))`,
                                  backgroundSize: "200% 100%",
                                  backgroundPosition: `${100 - pct}% 0`,
                                }}
                                initial={{ width: "0%" }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                              />
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td />
                  <td />
                </motion.tr>
              </tbody>
            </table>
          </DndContext>
        </div>
      </CardContent>
    </Card>
  );
}
