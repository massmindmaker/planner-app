import { db } from "@/lib/db";
import { lifeGoals } from "@/lib/db/schema";
import { updateLifeGoalSchema } from "@/lib/validators";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateLifeGoalSchema.parse(body);
    const [result] = await db
      .update(lifeGoals)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(lifeGoals.id, Number(id)))
      .returning();
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(lifeGoals).where(eq(lifeGoals.id, Number(id)));
  return NextResponse.json({ ok: true });
}
