"use client";
import { useState } from "react";
import { useRoutines, useCreateRoutine } from "@/hooks/use-routines";
import { RoutineCard } from "@/components/routines/routine-card";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Sun, Moon, Layers } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "morning", label: "Утро", icon: Sun, description: "Утренняя рутина для продуктивного старта" },
  { value: "evening", label: "Вечер", icon: Moon, description: "Вечерняя рутина для завершения дня" },
  { value: "custom", label: "Своя", icon: Layers, description: "Произвольная рутина в любое время" },
] as const;

export default function RoutinesPage() {
  const { data: routines, isLoading } = useRoutines();
  const createRoutine = useCreateRoutine();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"morning" | "evening" | "custom">("morning");

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    createRoutine.mutate(
      { name: trimmed, type },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setName("");
          setType("morning");
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Рутины</h1>
          <p className="text-muted-foreground mt-1">
            Структурируй свой день — утренние и вечерние ритуалы, которые делают тебя лучше.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Button onClick={() => setDialogOpen(true)} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Создать рутину
          </Button>
        </motion.div>
      </motion.div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (routines ?? []).length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center"
        >
          <Layers className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-1">Нет рутин</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Создай первую рутину и добавь в неё привычки.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Создать рутину
          </Button>
        </motion.div>
      )}

      {/* Routines grid */}
      {!isLoading && (routines ?? []).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence initial={false}>
            {(routines ?? []).map((routine: any, index: number) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08, ease: "easeOut" }}
              >
                <RoutineCard routine={routine} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create routine dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Новая рутина</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Название</label>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
                placeholder="Напр. Утренний заряд"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Тип</label>
              <div className="grid grid-cols-3 gap-2">
                {TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = type === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setType(opt.value)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-sm transition-colors ${
                        selected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {TYPE_OPTIONS.find((o) => o.value === type)?.description}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!name.trim() || createRoutine.isPending}
            >
              {createRoutine.isPending ? "Создание..." : "Создать"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
