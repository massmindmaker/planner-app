"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Star, Save, Loader2 } from "lucide-react";
import { useReviews, useCreateReview, useUpdateReview } from "@/hooks/use-reviews";
import { useMonthStats } from "@/hooks/use-stats";
import { CURRENT_YEAR } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  type: "weekly" | "monthly";
  year?: number;
  week?: number;
  month?: number;
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/40"
            )}
          />
        </motion.button>
      ))}
    </div>
  );
}

function AutoStats({
  type,
  month,
}: {
  type: "weekly" | "monthly";
  month?: number;
}) {
  const { data: stats } = useMonthStats(
    month ?? new Date().getMonth() + 1,
    CURRENT_YEAR
  );

  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="text-center p-3 rounded-lg bg-muted/40">
        <p className="text-lg font-bold">{stats.completedEntries ?? 0}</p>
        <p className="text-xs text-muted-foreground">Выполнено</p>
      </div>
      <div className="text-center p-3 rounded-lg bg-muted/40">
        <p className="text-lg font-bold">{stats.totalHabits ?? 0}</p>
        <p className="text-xs text-muted-foreground">Привычек</p>
      </div>
      <div className="text-center p-3 rounded-lg bg-muted/40">
        <p
          className={cn(
            "text-lg font-bold",
            (stats.progress ?? 0) >= 70
              ? "text-green-500"
              : (stats.progress ?? 0) >= 40
              ? "text-amber-500"
              : "text-red-500"
          )}
        >
          {stats.progress ?? 0}%
        </p>
        <p className="text-xs text-muted-foreground">Прогресс</p>
      </div>
    </div>
  );
}

export function ReviewForm({ type, year = CURRENT_YEAR, week, month }: ReviewFormProps) {
  const [open, setOpen] = useState(false);

  const queryParams = { year, type, ...(week ? { week } : {}), ...(month ? { month } : {}) };
  const { data: reviews } = useReviews(queryParams);
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  const existing = reviews?.[0];

  const [wentWell, setWentWell] = useState("");
  const [didntWork, setDidntWork] = useState("");
  const [nextFocus, setNextFocus] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);

  // Load existing data when available
  useEffect(() => {
    if (existing) {
      setWentWell(existing.went_well ?? "");
      setDidntWork(existing.didnt_work ?? "");
      setNextFocus(existing.next_focus ?? "");
      setNotes(existing.notes ?? "");
      setRating(existing.rating ?? 0);
    }
  }, [existing?.id]);

  const handleSave = async () => {
    const payload = {
      type,
      year,
      ...(week ? { week } : {}),
      ...(month ? { month } : {}),
      went_well: wentWell,
      didnt_work: didntWork,
      next_focus: nextFocus,
      notes,
      rating: rating || null,
    };

    if (existing?.id) {
      await updateReview.mutateAsync({ id: existing.id, data: payload });
    } else {
      await createReview.mutateAsync(payload);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isSaving = createReview.isPending || updateReview.isPending;
  const titleLabel = type === "weekly" ? "Итоги недели" : "Итоги месяца";
  const nextFocusLabel =
    type === "weekly" ? "Фокус на следующую неделю" : "Фокус на следующий месяц";

  return (
    <Card className="rounded-xl">
      <CardHeader
        className="pb-3 cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{titleLabel}</CardTitle>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </CardHeader>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="review-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="pt-0 space-y-4">
              {/* Auto-generated stats */}
              <AutoStats type={type} month={month} />

              {/* Оценка */}
              <div>
                <p className="text-sm font-medium mb-2">Общая оценка</p>
                <StarRating value={rating} onChange={setRating} />
              </div>

              {/* Что прошло хорошо */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Что прошло хорошо?
                </label>
                <textarea
                  value={wentWell}
                  onChange={(e) => setWentWell(e.target.value)}
                  placeholder="Опишите свои успехи..."
                  rows={3}
                  className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Что не получилось */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Что не получилось?
                </label>
                <textarea
                  value={didntWork}
                  onChange={(e) => setDidntWork(e.target.value)}
                  placeholder="Честная оценка трудностей..."
                  rows={3}
                  className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Фокус на следующий период */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  {nextFocusLabel}
                </label>
                <textarea
                  value={nextFocus}
                  onChange={(e) => setNextFocus(e.target.value)}
                  placeholder="Главный приоритет на следующий период..."
                  rows={2}
                  className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Заметки */}
              <div>
                <label className="text-sm font-medium block mb-1">Заметки</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Свободные мысли, наблюдения..."
                  rows={3}
                  className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  size="sm"
                  className={cn(
                    "gap-2 transition-colors",
                    saved && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saved ? "Сохранено!" : "Сохранить"}
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
