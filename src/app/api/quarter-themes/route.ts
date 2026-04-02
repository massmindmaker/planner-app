import { db } from "@/lib/db";
import { quarterThemes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { upsertQuarterThemeSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const yearParam = request.nextUrl.searchParams.get("year");

    if (!yearParam) {
      return NextResponse.json({ error: "year is required" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(quarterThemes)
      .where(eq(quarterThemes.year, Number(yearParam)));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = upsertQuarterThemeSchema.parse(body);
    const [result] = await db
      .insert(quarterThemes)
      .values(data)
      .onConflictDoUpdate({
        target: [quarterThemes.year, quarterThemes.quarter],
        set: { title: data.title, description: data.description },
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
