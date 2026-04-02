import { db } from "@/lib/db";
import { routines, habitTemplates } from "@/lib/db/schema";
import { createRoutineSchema } from "@/lib/validators";
import { asc, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const allRoutines = await db
    .select()
    .from(routines)
    .orderBy(asc(routines.position));

  if (allRoutines.length === 0) {
    return NextResponse.json([]);
  }

  const routineIds = allRoutines.map((r) => r.id);
  const allHabits = await db
    .select()
    .from(habitTemplates)
    .where(inArray(habitTemplates.routineId, routineIds))
    .orderBy(asc(habitTemplates.routineOrder));

  const result = allRoutines.map((routine) => ({
    ...routine,
    habits: allHabits.filter((h) => h.routineId === routine.id),
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createRoutineSchema.parse(body);
    const [result] = await db.insert(routines).values(data).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
