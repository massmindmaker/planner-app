"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export interface CategoryScore {
  categoryId: number;
  category: string;
  score: number;
}

interface ScoreInputProps {
  scores: CategoryScore[];
  onSave: (scores: CategoryScore[]) => void;
  isSaving?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  Карьера: "#3b82f6",
  Финансы: "#10b981",
  Творчество: "#8b5cf6",
  "Личное развитие": "#f59e0b",
  Взаимоотношения: "#f43f5e",
  Духовность: "#a855f7",
};

const DEFAULT_COLOR = "#6366f1";

function getCategoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? DEFAULT_COLOR;
}

export function ScoreInput({ scores, onSave, isSaving }: ScoreInputProps) {
  const [local, setLocal] = useState<CategoryScore[]>(scores);

  // Keep in sync when external scores change (e.g., after month switch)
  // but only if they differ from local (detect by reference)
  const [prevScores, setPrevScores] = useState(scores);
  if (prevScores !== scores) {
    setPrevScores(scores);
    setLocal(scores);
  }

  function handleChange(categoryId: number, value: number) {
    setLocal((prev) =>
      prev.map((s) => (s.categoryId === categoryId ? { ...s, score: value } : s))
    );
  }

  function handleSave() {
    onSave(local);
  }

  return (
    <div className="space-y-4">
      {local.map((item) => {
        const color = getCategoryColor(item.category);
        return (
          <div key={item.categoryId} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium">{item.category}</span>
              </div>
              <span
                className="text-sm font-bold tabular-nums w-5 text-right"
                style={{ color }}
              >
                {item.score}
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={item.score}
              onValueChange={(v) =>
                handleChange(item.categoryId, typeof v === "number" ? v : Array.isArray(v) ? v[0] : item.score)
              }
              className="w-full"
              style={
                {
                  "--slider-color": color,
                } as React.CSSProperties
              }
            />
          </div>
        );
      })}

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full mt-2"
        size="sm"
      >
        {isSaving ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>
  );
}
