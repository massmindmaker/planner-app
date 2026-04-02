import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { createReviewSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const yearParam = request.nextUrl.searchParams.get("year");
    const typeParam = request.nextUrl.searchParams.get("type");
    const weekParam = request.nextUrl.searchParams.get("week");
    const monthParam = request.nextUrl.searchParams.get("month");

    const conditions = [];
    if (yearParam) conditions.push(eq(reviews.year, Number(yearParam)));
    if (typeParam) conditions.push(eq(reviews.type, typeParam));
    if (weekParam) conditions.push(eq(reviews.week, Number(weekParam)));
    if (monthParam) conditions.push(eq(reviews.month, Number(monthParam)));

    const result = conditions.length > 0
      ? await db.select().from(reviews).where(and(...conditions))
      : await db.select().from(reviews);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createReviewSchema.parse(body);
    const [result] = await db.insert(reviews).values(data).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
