import { db } from "@/lib/db";
import { yearlyGoals } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { createGoalSchema } from "@/lib/validators";
import { CURRENT_YEAR } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const year = Number(request.nextUrl.searchParams.get("year")) || CURRENT_YEAR;
  const result = await db
    .select()
    .from(yearlyGoals)
    .where(eq(yearlyGoals.year, year))
    .orderBy(asc(yearlyGoals.categoryId), asc(yearlyGoals.position));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = createGoalSchema.parse(body);
  const [result] = await db.insert(yearlyGoals).values(data).returning();
  return NextResponse.json(result, { status: 201 });
}
