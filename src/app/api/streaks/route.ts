import { db } from "@/lib/db";
import { dailyHabits, dailyHabitEntries, habitTemplates } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { calculatePositiveStreak, calculateNegativeStreak } from "@/lib/streaks";

export async function GET() {
  // Get all active habit templates
  const templates = await db
    .select()
    .from(habitTemplates)
    .where(eq(habitTemplates.active, true));

  if (templates.length === 0) {
    return NextResponse.json([]);
  }

  const results = await Promise.all(
    templates.map(async (template) => {
      // Get all daily_habits for this template
      const habits = await db
        .select({ id: dailyHabits.id })
        .from(dailyHabits)
        .where(eq(dailyHabits.templateId, template.id));

      if (habits.length === 0) {
        return {
          templateId: template.id,
          name: template.name,
          polarity: template.polarity,
          streak: 0,
          createdAt: template.createdAt,
        };
      }

      // Get all entries for these daily habits
      const habitIds = habits.map((h) => h.id);
      const allEntries: { date: string; completed: boolean }[] = [];

      for (const habitId of habitIds) {
        const entries = await db
          .select({ date: dailyHabitEntries.date, completed: dailyHabitEntries.completed })
          .from(dailyHabitEntries)
          .where(eq(dailyHabitEntries.habitId, habitId));
        allEntries.push(...entries);
      }

      // Deduplicate entries by date (take any completed=true for a date)
      const byDate = new Map<string, boolean>();
      for (const e of allEntries) {
        if (!byDate.has(e.date) || e.completed) {
          byDate.set(e.date, e.completed);
        }
      }
      const deduped = Array.from(byDate.entries()).map(([date, completed]) => ({
        date,
        completed,
      }));

      const streak =
        template.polarity === "negative"
          ? calculateNegativeStreak(deduped, new Date(template.createdAt))
          : calculatePositiveStreak(deduped);

      return {
        templateId: template.id,
        name: template.name,
        polarity: template.polarity,
        streak,
        createdAt: template.createdAt,
      };
    })
  );

  const sorted = results
    .filter((r) => r.streak > 0)
    .sort((a, b) => b.streak - a.streak);

  return NextResponse.json(sorted);
}
