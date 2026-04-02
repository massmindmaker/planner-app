import { db } from "@/lib/db";
import { dailyHabits, dailyHabitEntries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getISOWeek } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  const entries = await db
    .select({ date: dailyHabitEntries.date, completed: dailyHabitEntries.completed })
    .from(dailyHabitEntries)
    .innerJoin(dailyHabits, eq(dailyHabitEntries.habitId, dailyHabits.id))
    .where(eq(dailyHabits.year, year));

  const weekMap = new Map<number, { total: number; completed: number }>();
  for (const e of entries) {
    const week = getISOWeek(new Date(e.date));
    const w = weekMap.get(week) ?? { total: 0, completed: 0 };
    w.total++;
    if (e.completed) w.completed++;
    weekMap.set(week, w);
  }

  const trends = Array.from(weekMap.entries())
    .map(([week, stats]) => ({
      week,
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    }))
    .sort((a, b) => a.week - b.week);

  return NextResponse.json(trends);
}
