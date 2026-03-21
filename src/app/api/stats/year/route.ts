import { db } from "@/lib/db";
import { dailyHabits, dailyHabitEntries, yearlyGoals } from "@/lib/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { CURRENT_YEAR } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const year = Number(request.nextUrl.searchParams.get("year")) || CURRENT_YEAR;

  // Goals stats
  const goals = await db
    .select({
      total: count(),
      completed: count(sql`CASE WHEN ${yearlyGoals.completed} THEN 1 END`),
    })
    .from(yearlyGoals)
    .where(eq(yearlyGoals.year, year));

  // Per-month progress
  const monthStats = [];
  for (let m = 1; m <= 12; m++) {
    const habits = await db
      .select({ id: dailyHabits.id })
      .from(dailyHabits)
      .where(and(eq(dailyHabits.year, year), eq(dailyHabits.month, m)));

    if (habits.length === 0) {
      monthStats.push({ month: m, progress: 0, totalHabits: 0 });
      continue;
    }

    const entries = await db
      .select({ completed: count() })
      .from(dailyHabitEntries)
      .where(
        and(
          eq(dailyHabitEntries.completed, true),
          sql`${dailyHabitEntries.habitId} IN (
            SELECT id FROM daily_habits WHERE year = ${year} AND month = ${m}
          )`
        )
      );

    const totalDays = habits.length * new Date(year, m, 0).getDate();
    const completedCount = entries[0]?.completed ?? 0;
    monthStats.push({
      month: m,
      progress: totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0,
      totalHabits: habits.length,
    });
  }

  return NextResponse.json({
    goals: goals[0],
    months: monthStats,
  });
}
