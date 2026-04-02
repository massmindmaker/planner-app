"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  { key: "N", description: "Новая привычка" },
  { key: "?", description: "Показать / скрыть этот экран" },
  { key: "Space / Enter", description: "Переключить чекбокс (в фокусе)" },
  { key: "↑ ↓ ← →", description: "Навигация по ячейкам таблицы" },
  { key: "Tab", description: "Следующий интерактивный элемент" },
];

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Горячие клавиши</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          {SHORTCUTS.map(({ key, description }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <kbd className="inline-flex items-center rounded border border-border bg-muted px-2 py-0.5 text-xs font-mono font-semibold text-foreground whitespace-nowrap">
                {key}
              </kbd>
              <span className="text-sm text-muted-foreground text-right flex-1">{description}</span>
            </div>
          ))}
        </div>
        <DialogClose render={
          <Button variant="outline" className="w-full mt-2">
            Закрыть
          </Button>
        } />
      </DialogContent>
    </Dialog>
  );
}
