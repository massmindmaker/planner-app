import { db } from "@/lib/db";
import { energyLogs } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { upsertEnergySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const dateParam = request.nextUrl.searchParams.get("date");
    const startParam = request.nextUrl.searchParams.get("start");
    const endParam = request.nextUrl.searchParams.get("end");

    if (dateParam) {
      const [result] = await db
        .select()
        .from(energyLogs)
        .where(eq(energyLogs.date, dateParam));
      return NextResponse.json(result ?? null);
    }

    if (startParam && endParam) {
      const result = await db
        .select()
        .from(energyLogs)
        .where(and(gte(energyLogs.date, startParam), lte(energyLogs.date, endParam)));
      return NextResponse.json(result);
    }

    const result = await db.select().from(energyLogs);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = upsertEnergySchema.parse(body);
    const [result] = await db
      .insert(energyLogs)
      .values(data)
      .onConflictDoUpdate({
        target: energyLogs.date,
        set: { level: data.level },
      })
      .returning();
    return NextResponse.json(result);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
