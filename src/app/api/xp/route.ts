import { db } from "@/lib/db";
import { userXp } from "@/lib/db/schema";
import { sum, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getLevel } from "@/lib/xp";

export async function GET() {
  try {
    const [totalRow] = await db.select({ total: sum(userXp.xpGained) }).from(userXp);
    const totalXp = Number(totalRow?.total ?? 0);
    const levelInfo = getLevel(totalXp);

    const recent = await db
      .select()
      .from(userXp)
      .orderBy(desc(userXp.id))
      .limit(20);

    return NextResponse.json({ ...levelInfo, recent });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, xpGained, source, sourceId } = body;

    if (!date || xpGained === undefined || !source) {
      return NextResponse.json({ error: "date, xpGained, and source are required" }, { status: 400 });
    }

    const [result] = await db
      .insert(userXp)
      .values({ date, xpGained, source, sourceId: sourceId ?? null })
      .onConflictDoNothing()
      .returning();

    return NextResponse.json(result ?? { skipped: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
