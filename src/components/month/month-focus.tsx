"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Check } from "lucide-react";
import {
  useMonthFocus,
  useCreateMonthFocus,
  useUpdateMonthFocus,
  useDeleteMonthFocus,
} from "@/hooks/use-month-focus";
import { CURRENT_YEAR } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MonthFocusProps {
  month: number;
}

interface FocusItemProps {
  item: { id: number; title: string; completed: boolean };
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onRename: (id: number, title: string) => void;
  index: number;
}

function FocusItem({ item, onToggle, onDelete, onRename, index }: FocusItemProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.title);

  const commitEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== item.title) {
      onRename(item.id, trimmed);
    } else {
      setEditValue(item.title);
    }
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="flex items-center gap-2 group py-1"
    >
      {/* Checkbox */}
      <motion.button
        type="button"
        onClick={() => onToggle(item.id, !item.completed)}
        whileTap={{ scale: 0.85 }}
        className={cn(
          "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
          item.completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-muted-foreground/50 hover:border-primary"
        )}
      >
        <AnimatePresence>
          {item.completed && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="h-3 w-3" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Title — inline editable */}
      {editing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") {
              setEditValue(item.title);
              setEditing(false);
            }
          }}
          className="flex-1 text-sm bg-transparent border-b border-primary outline-none py-0.5"
        />
      ) : (
        <span
          onDoubleClick={() => {
            setEditValue(item.title);
            setEditing(true);
          }}
          className={cn(
            "flex-1 text-sm cursor-text select-none",
            item.completed && "line-through text-muted-foreground"
          )}
        >
          {item.title}
        </span>
      )}

      {/* Delete button */}
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.6 }}
        whileHover={{ opacity: 1, scale: 1 }}
        onClick={() => onDelete(item.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-destructive hover:text-destructive/80 p-0.5 rounded"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </motion.button>
    </motion.div>
  );
}

export function MonthFocus({ month }: MonthFocusProps) {
  const { data: items, isLoading } = useMonthFocus(month, CURRENT_YEAR);
  const create = useCreateMonthFocus();
  const update = useUpdateMonthFocus();
  const remove = useDeleteMonthFocus();
  const [newTitle, setNewTitle] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [deletedItems, setDeletedItems] = useState<{ id: number; title: string; completed: boolean }[]>([]);
  const deleteTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const rawItems: { id: number; title: string; completed: boolean }[] = items ?? [];
  const focusItems = rawItems.filter((i) => !deletedItems.some((d) => d.id === i.id));

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    create.mutate({ month, year: CURRENT_YEAR, title: trimmed, completed: false });
    setNewTitle("");
  };

  const handleToggle = (id: number, completed: boolean) => {
    update.mutate({ id, data: { completed } });
  };

  const handleRename = (id: number, title: string) => {
    update.mutate({ id, data: { title } });
  };

  const handleDelete = (id: number) => {
    const item = rawItems.find((i) => i.id === id);
    if (!item) return;

    // Optimistically remove from UI
    setDeletedItems((prev) => [...prev, item]);

    // Show undo toast
    toast("Удалено", {
      action: {
        label: "Отменить",
        onClick: () => {
          clearTimeout(deleteTimers.current.get(id));
          deleteTimers.current.delete(id);
          setDeletedItems((prev) => prev.filter((d) => d.id !== id));
        },
      },
      duration: 5000,
    });

    // After 5s actually delete
    const timer = setTimeout(() => {
      remove.mutate(id);
      deleteTimers.current.delete(id);
      setDeletedItems((prev) => prev.filter((d) => d.id !== id));
    }, 5000);
    deleteTimers.current.set(id, timer);
  };

  const completedCount = focusItems.filter((i) => i.completed).length;

  if (isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Фокус месяца</CardTitle>
            {focusItems.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {completedCount}/{focusItems.length}
              </span>
            )}
          </div>
          {focusItems.length > 0 && (
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: `${(completedCount / focusItems.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-0.5">
          <AnimatePresence mode="popLayout">
            {focusItems.map((item, idx) => (
              <FocusItem
                key={item.id}
                item={item}
                index={idx}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))}
          </AnimatePresence>

          {focusItems.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground py-2 text-center"
            >
              Добавьте фокусы для этого месяца
            </motion.p>
          )}

          {/* Add input */}
          <motion.div
            className="flex gap-2 pt-3"
            animate={{
              scale: inputFocused ? 1.01 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Добавить фокус..."
              className={cn(
                "text-sm transition-all duration-200",
                inputFocused ? "h-9 ring-2 ring-primary/30" : "h-8"
              )}
            />
            <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim()}>
              <Plus className="h-3 w-3 mr-1" /> Добавить
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
