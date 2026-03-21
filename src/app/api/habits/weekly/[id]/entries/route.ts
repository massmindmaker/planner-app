import { db } from "@/lib/db";
import { weeklyHabitEntries } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { toggleWeeklyEntrySchema } from "@/lib/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { week, completed } = toggleWeeklyEntrySchema.parse(body);
  const habitId = Number(id);

  const existing = await db
    .select()
    .from(weeklyHabitEntries)
    .where(
      and(
        eq(weeklyHabitEntries.habitId, habitId),
        eq(weeklyHabitEntries.week, week)
      )
    );

  let result;
  if (existing.length > 0) {
    [result] = await db
      .update(weeklyHabitEntries)
      .set({ completed })
      .where(eq(weeklyHabitEntries.id, existing[0].id))
      .returning();
  } else {
    [result] = await db
      .insert(weeklyHabitEntries)
      .values({ habitId, week, completed })
      .returning();
  }

  return NextResponse.json(result);
}
