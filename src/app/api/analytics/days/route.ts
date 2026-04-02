import { db } from "@/lib/db";
import { dailyHabits, dailyHabitEntries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getDay } from "date-fns";
import { NextResponse } from "next/server";

const DAY_NAMES = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  const entries = await db
    .select({ date: dailyHabitEntries.date, completed: dailyHabitEntries.completed })
    .from(dailyHabitEntries)
    .innerJoin(dailyHabits, eq(dailyHabitEntries.habitId, dailyHabits.id))
    .where(eq(dailyHabits.year, year));

  const dayMap = new Map<number, { total: number; completed: number }>();
  for (const e of entries) {
    const dayIndex = getDay(new Date(e.date));
    const d = dayMap.get(dayIndex) ?? { total: 0, completed: 0 };
    d.total++;
    if (e.completed) d.completed++;
    dayMap.set(dayIndex, d);
  }

  const days = Array.from({ length: 7 }, (_, i) => {
    const stats = dayMap.get(i) ?? { total: 0, completed: 0 };
    return {
      day: DAY_NAMES[i],
      dayIndex: i,
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    };
  });

  return NextResponse.json(days);
}
