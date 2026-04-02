import { db } from "@/lib/db";
import { wheelOfLife } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { saveWheelSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const yearParam = request.nextUrl.searchParams.get("year");
    const monthParam = request.nextUrl.searchParams.get("month");

    if (!yearParam) {
      return NextResponse.json({ error: "year is required" }, { status: 400 });
    }

    const year = Number(yearParam);

    if (monthParam) {
      const result = await db
        .select()
        .from(wheelOfLife)
        .where(and(eq(wheelOfLife.year, year), eq(wheelOfLife.month, Number(monthParam))));
      return NextResponse.json(result);
    }

    const result = await db
      .select()
      .from(wheelOfLife)
      .where(eq(wheelOfLife.year, year));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = saveWheelSchema.parse(body);

    const values = data.scores.map((s) => ({
      year: data.year,
      month: data.month,
      categoryId: s.categoryId,
      score: s.score,
    }));

    const result = await db
      .insert(wheelOfLife)
      .values(values)
      .onConflictDoUpdate({
        target: [wheelOfLife.year, wheelOfLife.month, wheelOfLife.categoryId],
        set: { score: wheelOfLife.score },
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
