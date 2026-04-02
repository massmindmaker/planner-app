import { db } from "@/lib/db";
import { dailyHabits, dailyHabitEntries, energyLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year")) || new Date().getFullYear();

  const [entries, logs] = await Promise.all([
    db
      .select({ date: dailyHabitEntries.date, completed: dailyHabitEntries.completed })
      .from(dailyHabitEntries)
      .innerJoin(dailyHabits, eq(dailyHabitEntries.habitId, dailyHabits.id))
      .where(eq(dailyHabits.year, year)),
    db.select({ date: energyLogs.date, level: energyLogs.level }).from(energyLogs),
  ]);

  // Aggregate habit entries by date
  const habitMap = new Map<string, { total: number; completed: number }>();
  for (const e of entries) {
    const d = habitMap.get(e.date) ?? { total: 0, completed: 0 };
    d.total++;
    if (e.completed) d.completed++;
    habitMap.set(e.date, d);
  }

  // Build energy map by date
  const energyMap = new Map<string, number>();
  for (const log of logs) {
    energyMap.set(log.date, log.level);
  }

  // Correlate: only dates that have both energy log and habit entries
  const result: { date: string; energy: number; completionPercent: number }[] = [];
  for (const [date, stats] of habitMap.entries()) {
    const energy = energyMap.get(date);
    if (energy !== undefined) {
      result.push({
        date,
        energy,
        completionPercent: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      });
    }
  }

  result.sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json(result);
}
