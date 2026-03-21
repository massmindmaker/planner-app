import { db } from "@/lib/db";
import { dailyHabits, dailyHabitEntries } from "@/lib/db/schema";
import { eq, and, count, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { CURRENT_YEAR, getDaysInMonth } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  const { month: monthStr } = await params;
  const month = Number(monthStr);
  const year = Number(request.nextUrl.searchParams.get("year")) || CURRENT_YEAR;

  if (month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid month" }, { status: 400 });
  }

  const habits = await db
    .select()
    .from(dailyHabits)
    .where(and(eq(dailyHabits.year, year), eq(dailyHabits.month, month)));

  const habitIds = habits.map((h) => h.id);
  const totalDays = getDaysInMonth(year, month);
  const totalSlots = habits.length * totalDays;

  let completedCount = 0;
  if (habitIds.length > 0) {
    const result = await db
      .select({ count: count() })
      .from(dailyHabitEntries)
      .where(
        and(
          inArray(dailyHabitEntries.habitId, habitIds),
          eq(dailyHabitEntries.completed, true)
        )
      );
    completedCount = result[0]?.count ?? 0;
  }

  return NextResponse.json({
    month,
    year,
    totalHabits: habits.length,
    completedEntries: completedCount,
    totalSlots,
    progress: totalSlots > 0 ? Math.round((completedCount / totalSlots) * 100) : 0,
  });
}
