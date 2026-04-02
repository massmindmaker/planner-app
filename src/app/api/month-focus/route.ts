import { db } from "@/lib/db";
import { monthFocus } from "@/lib/db/schema";
import { createMonthFocusSchema } from "@/lib/validators";
import { eq, and, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const month = Number(request.nextUrl.searchParams.get("month"));
  const year = Number(request.nextUrl.searchParams.get("year"));

  const result = await db
    .select()
    .from(monthFocus)
    .where(and(eq(monthFocus.year, year), eq(monthFocus.month, month)))
    .orderBy(asc(monthFocus.position));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createMonthFocusSchema.parse(body);
    const [result] = await db.insert(monthFocus).values(data).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
