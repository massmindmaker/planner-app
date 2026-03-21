import { db } from "@/lib/db";
import { weeklyHabits } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { updateWeeklyHabitSchema } from "@/lib/validators";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const data = updateWeeklyHabitSchema.parse(body);
  const [result] = await db
    .update(weeklyHabits)
    .set(data)
    .where(eq(weeklyHabits.id, Number(id)))
    .returning();
  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(weeklyHabits).where(eq(weeklyHabits.id, Number(id)));
  return NextResponse.json({ ok: true });
}
