import { db } from "@/lib/db";
import { dailyHabits, dailyHabitEntries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  const entries = await db
    .select({ date: dailyHabitEntries.date, completed: dailyHabitEntries.completed })
    .from(dailyHabitEntries)
    .innerJoin(dailyHabits, eq(dailyHabitEntries.habitId, dailyHabits.id))
    .where(eq(dailyHabits.year, year));

  const dateMap = new Map<string, { total: number; completed: number }>();
  for (const e of entries) {
    const d = dateMap.get(e.date) ?? { total: 0, completed: 0 };
    d.total++;
    if (e.completed) d.completed++;
    dateMap.set(e.date, d);
  }

  const heatmap = Array.from(dateMap.entries()).map(([date, stats]) => ({
    date,
    total: stats.total,
    completed: stats.completed,
    percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
  }));

  return NextResponse.json(heatmap);
}
