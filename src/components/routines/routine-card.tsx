"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { motion, AnimatePresence } from "motion/react";
import {
  GripVertical,
  Plus,
  Trash2,
  Sun,
  Moon,
  Layers,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useUpdateHabitTemplate, useCreateHabitTemplate, useDeleteHabitTemplate } from "@/hooks/use-habit-templates";
import { useDeleteRoutine } from "@/hooks/use-routines";

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; badgeClass: string; color: string }> = {
  morning: { label: "Утро", icon: Sun, badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", color: "text-amber-500" },
  evening: { label: "Вечер", icon: Moon, badgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", color: "text-indigo-500" },
  custom: { label: "Своя", icon: Layers, badgeClass: "bg-muted text-muted-foreground", color: "text-muted-foreground" },
};

interface Habit {
  id: number;
  name: string;
  routineOrder: number | null;
  routineId: number | null;
}

interface Routine {
  id: number;
  name: string;
  type: string;
  habits: Habit[];
}

interface SortableHabitRowProps {
  habit: Habit;
  onDelete: (id: number) => void;
}

function SortableHabitRow({ habit, onDelete }: SortableHabitRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: habit.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 group"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        aria-label="Перетащить"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="flex-1 text-sm">{habit.name}</span>
      <button
        onClick={() => onDelete(habit.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
        aria-label="Удалить привычку"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface RoutineCardProps {
  routine: Routine;
}

export function RoutineCard({ routine }: RoutineCardProps) {
  const [habits, setHabits] = useState<Habit[]>(routine.habits);
  const [addingHabit, setAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const updateHabit = useUpdateHabitTemplate();
  const createHabit = useCreateHabitTemplate();
  const deleteHabit = useDeleteHabitTemplate();
  const deleteRoutine = useDeleteRoutine();

  const typeConfig = TYPE_CONFIG[routine.type] ?? TYPE_CONFIG.custom;
  const TypeIcon = typeConfig.icon;

  // Sync habits when routine prop changes (after refetch)
  useState(() => {
    setHabits(routine.habits);
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const completedCount = 0; // Runtime tracking — no completion data from templates
  const totalCount = habits.length;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = habits.findIndex((h) => h.id === active.id);
    const newIndex = habits.findIndex((h) => h.id === over.id);
    const reordered = arrayMove(habits, oldIndex, newIndex);
    setHabits(reordered);

    reordered.forEach((habit, index) => {
      updateHabit.mutate({ id: habit.id, data: { routineOrder: index + 1 } });
    });
  }

  function handleAddHabit() {
    const name = newHabitName.trim();
    if (!name) return;

    createHabit.mutate(
      {
        name,
        routineId: routine.id,
        routineOrder: habits.length + 1,
        polarity: "positive",
      },
      {
        onSuccess: (created: any) => {
          setHabits((prev) => [...prev, created]);
          setNewHabitName("");
          setAddingHabit(false);
        },
      }
    );
  }

  function handleDeleteHabit(id: number) {
    deleteHabit.mutate(id, {
      onSuccess: () => {
        setHabits((prev) => prev.filter((h) => h.id !== id));
      },
    });
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TypeIcon className={`h-4 w-4 ${typeConfig.color}`} />
            <span className="flex-1">{routine.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeConfig.badgeClass}`}>
              {typeConfig.label}
            </span>
            {totalCount > 0 && (
              <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {completedCount}/{totalCount} выполнено
              </span>
            )}
            <ConfirmationDialog
              trigger={
                <button
                  className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                  aria-label="Удалить рутину"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              }
              title="Удалить рутину?"
              description={`Рутина «${routine.name}» будет удалена. Привычки останутся, но потеряют привязку к рутине.`}
              onConfirm={() => deleteRoutine.mutate(routine.id)}
              destructive
            />
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0 space-y-1">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={habits.map((h) => h.id)} strategy={verticalListSortingStrategy}>
              <AnimatePresence initial={false}>
                {habits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SortableHabitRow habit={habit} onDelete={handleDeleteHabit} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>

          {habits.length === 0 && !addingHabit && (
            <p className="text-xs text-muted-foreground text-center py-2 italic">
              Нет привычек. Добавьте первую!
            </p>
          )}

          <AnimatePresence>
            {addingHabit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 pt-1"
              >
                <Input
                  autoFocus
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddHabit();
                    if (e.key === "Escape") { setAddingHabit(false); setNewHabitName(""); }
                  }}
                  placeholder="Название привычки..."
                  className="h-8 text-sm"
                />
                <Button size="sm" onClick={handleAddHabit} disabled={!newHabitName.trim() || createHabit.isPending}>
                  Добавить
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setAddingHabit(false); setNewHabitName(""); }}>
                  Отмена
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!addingHabit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAddingHabit(true)}
              className="w-full mt-1 text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3 w-3 mr-1" />
              Добавить привычку
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
