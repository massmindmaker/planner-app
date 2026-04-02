import { db } from "@/lib/db";
import { dailyHabits, dailyHabitEntries, habitTemplates } from "@/lib/db/schema";
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

  // Polarity breakdown: positive vs negative habits progress
  const positiveHabitIds: number[] = [];
  const negativeHabitIds: number[] = [];

  if (habits.length > 0) {
    // Get template polarity for habits that have a templateId
    const templateIds = habits
      .map((h) => h.templateId)
      .filter((id): id is number => id != null);

    const templates =
      templateIds.length > 0
        ? await db
            .select({ id: habitTemplates.id, polarity: habitTemplates.polarity })
            .from(habitTemplates)
            .where(inArray(habitTemplates.id, templateIds))
        : [];

    const templatePolarityMap = new Map(
      templates.map((t) => [t.id, t.polarity])
    );

    for (const habit of habits) {
      const polarity =
        habit.templateId != null
          ? (templatePolarityMap.get(habit.templateId) ?? "positive")
          : "positive";
      if (polarity === "negative") {
        negativeHabitIds.push(habit.id);
      } else {
        positiveHabitIds.push(habit.id);
      }
    }
  }

  const getCompletedCount = async (ids: number[]) => {
    if (ids.length === 0) return 0;
    const result = await db
      .select({ count: count() })
      .from(dailyHabitEntries)
      .where(
        and(
          inArray(dailyHabitEntries.habitId, ids),
          eq(dailyHabitEntries.completed, true)
        )
      );
    return result[0]?.count ?? 0;
  };

  const positiveCompleted = await getCompletedCount(positiveHabitIds);
  const negativeCompleted = await getCompletedCount(negativeHabitIds);

  const positiveSlots = positiveHabitIds.length * totalDays;
  const negativeSlots = negativeHabitIds.length * totalDays;

  return NextResponse.json({
    month,
    year,
    totalHabits: habits.length,
    completedEntries: completedCount,
    totalSlots,
    progress: totalSlots > 0 ? Math.round((completedCount / totalSlots) * 100) : 0,
    polarity: {
      positive: {
        totalHabits: positiveHabitIds.length,
        completedEntries: positiveCompleted,
        totalSlots: positiveSlots,
        progress:
          positiveSlots > 0
            ? Math.round((positiveCompleted / positiveSlots) * 100)
            : 0,
      },
      negative: {
        totalHabits: negativeHabitIds.length,
        completedEntries: negativeCompleted,
        totalSlots: negativeSlots,
        progress:
          negativeSlots > 0
            ? Math.round((negativeCompleted / negativeSlots) * 100)
            : 0,
      },
    },
  });
}
