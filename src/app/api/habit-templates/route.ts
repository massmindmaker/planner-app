import { db } from "@/lib/db";
import { habitTemplates } from "@/lib/db/schema";
import { createHabitTemplateSchema } from "@/lib/validators";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await db
    .select()
    .from(habitTemplates)
    .orderBy(asc(habitTemplates.position));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createHabitTemplateSchema.parse(body);
    const [result] = await db.insert(habitTemplates).values(data).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
