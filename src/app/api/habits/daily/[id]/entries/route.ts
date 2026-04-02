import { db } from "@/lib/db";
import { dailyHabits, dailyHabitEntries, habitTemplates } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { toggleDailyEntrySchema } from "@/lib/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { date, completed: completedFromBody } = toggleDailyEntrySchema.parse(body);
  const habitId = Number(id);

  // Accept optional value and isMinimum
  const value: number | null = body.value !== undefined ? body.value : null;
  const isMinimum: boolean = body.isMinimum === true;

  // For numeric habits: if value is provided, auto-set completed based on targetValue
  let completed = completedFromBody;
  if (value !== null) {
    // Look up the habit's template to get targetValue
    const habit = await db
      .select({ templateId: dailyHabits.templateId })
      .from(dailyHabits)
      .where(eq(dailyHabits.id, habitId));

    if (habit.length > 0 && habit[0].templateId != null) {
      const template = await db
        .select({ targetValue: habitTemplates.targetValue })
        .from(habitTemplates)
        .where(eq(habitTemplates.id, habit[0].templateId));

      if (template.length > 0 && template[0].targetValue != null) {
        completed = value >= template[0].targetValue;
      }
    }
  }

  // Upsert: insert or update
  const existing = await db
    .select()
    .from(dailyHabitEntries)
    .where(
      and(
        eq(dailyHabitEntries.habitId, habitId),
        eq(dailyHabitEntries.date, date)
      )
    );

  let result;
  if (existing.length > 0) {
    [result] = await db
      .update(dailyHabitEntries)
      .set({ completed, value, isMinimum })
      .where(eq(dailyHabitEntries.id, existing[0].id))
      .returning();
  } else {
    [result] = await db
      .insert(dailyHabitEntries)
      .values({ habitId, date, completed, value, isMinimum })
      .returning();
  }

  return NextResponse.json(result);
}
