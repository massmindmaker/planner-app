import { db } from "@/lib/db";
import { lifeGoals } from "@/lib/db/schema";
import { createLifeGoalSchema } from "@/lib/validators";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await db
    .select()
    .from(lifeGoals)
    .orderBy(asc(lifeGoals.categoryId), asc(lifeGoals.position));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createLifeGoalSchema.parse(body);
    const [result] = await db.insert(lifeGoals).values(data).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
