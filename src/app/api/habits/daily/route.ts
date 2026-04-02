import { db } from "@/lib/db";
import { dailyHabits, dailyHabitEntries, habitTemplates } from "@/lib/db/schema";
import { eq, and, asc, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { createDailyHabitSchema } from "@/lib/validators";
import { CURRENT_YEAR } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const year = Number(sp.get("year")) || CURRENT_YEAR;
  const month = Number(sp.get("month"));
  if (!month) return NextResponse.json({ error: "month required" }, { status: 400 });

  const habits = await db
    .select()
    .from(dailyHabits)
    .where(and(eq(dailyHabits.year, year), eq(dailyHabits.month, month)))
    .orderBy(asc(dailyHabits.position));

  const habitIds = habits.map((h) => h.id);
  const entries = habitIds.length
    ? await db
        .select()
        .from(dailyHabitEntries)
        .where(inArray(dailyHabitEntries.habitId, habitIds))
    : [];

  return NextResponse.json({ habits, entries });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = createDailyHabitSchema.parse(body);

  // If no templateId, auto-create a habit template
  let templateId = body.templateId as number | undefined;
  if (!templateId && body.name) {
    const [template] = await db.insert(habitTemplates).values({
      name: body.name,
      polarity: body.polarity || "positive",
      habitType: body.habitType || "boolean",
      targetValue: body.targetValue || null,
      unit: body.unit || null,
      minVersion: body.minVersion || null,
    }).returning({ id: habitTemplates.id });
    templateId = template.id;
  }

  const [result] = await db.insert(dailyHabits).values({ ...data, templateId }).returning();
  return NextResponse.json(result, { status: 201 });
}
