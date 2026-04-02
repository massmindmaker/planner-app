"use client";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NumericPopoverProps {
  /** Current numeric value (or null if not set) */
  value: number | null;
  completed: boolean;
  targetValue: number | null;
  unit: string | null;
  onSave: (value: number, completed: boolean) => void;
  isNegative?: boolean;
}

export function NumericPopover({
  value,
  completed,
  targetValue,
  unit,
  onSave,
  isNegative = false,
}: NumericPopoverProps) {
  const [open, setOpen] = useState(false);
  const [inputVal, setInputVal] = useState<string>(value != null ? String(value) : "");

  const handleSave = () => {
    const num = parseFloat(inputVal);
    if (isNaN(num) || num < 0) return;
    const autoCompleted =
      targetValue != null
        ? isNegative
          ? num <= targetValue
          : num >= targetValue
        : num > 0;
    onSave(num, autoCompleted);
    setOpen(false);
  };

  const displayValue = value != null ? value : "—";

  // Color coding for the trigger button
  const colorClass = completed
    ? isNegative
      ? "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40"
      : "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/40"
    : value != null
    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40"
    : "bg-muted/50 text-muted-foreground border-muted-foreground/20";

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setInputVal(value != null ? String(value) : ""); }}>
      <PopoverTrigger
          className={cn(
            "inline-flex items-center justify-center w-10 h-6 rounded-md border text-[10px] font-mono font-medium transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            colorClass
          )}
        >
          {displayValue}
      </PopoverTrigger>
      <PopoverContent className="w-52" side="bottom">
        <div className="flex flex-col gap-2">
          {targetValue != null && (
            <p className="text-xs text-muted-foreground">
              Цель: {targetValue}{unit ? ` ${unit}` : ""}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              className="h-7 text-sm"
              autoFocus
              placeholder="0"
            />
            {unit && (
              <span className="text-xs text-muted-foreground shrink-0">{unit}</span>
            )}
          </div>
          <Button size="sm" className="h-7 text-xs" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
