import { db } from "@/lib/db";
import { weeklyPlans } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { createWeeklyPlanSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const week = Number(request.nextUrl.searchParams.get("week"));
    const year = Number(request.nextUrl.searchParams.get("year"));

    if (!week || !year) {
      return NextResponse.json({ error: "week and year are required" }, { status: 400 });
    }

    const [result] = await db
      .select()
      .from(weeklyPlans)
      .where(and(eq(weeklyPlans.year, year), eq(weeklyPlans.week, week)));

    return NextResponse.json(result ?? null);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createWeeklyPlanSchema.parse(body);
    const [result] = await db
      .insert(weeklyPlans)
      .values(data)
      .onConflictDoUpdate({
        target: [weeklyPlans.year, weeklyPlans.week],
        set: { focus: data.focus },
      })
      .returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
