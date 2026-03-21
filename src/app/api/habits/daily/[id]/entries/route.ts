import { db } from "@/lib/db";
import { dailyHabitEntries } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { toggleDailyEntrySchema } from "@/lib/validators";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { date, completed } = toggleDailyEntrySchema.parse(body);
  const habitId = Number(id);

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
      .set({ completed })
      .where(eq(dailyHabitEntries.id, existing[0].id))
      .returning();
  } else {
    [result] = await db
      .insert(dailyHabitEntries)
      .values({ habitId, date, completed })
      .returning();
  }

  return NextResponse.json(result);
}
