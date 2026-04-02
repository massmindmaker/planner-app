import { db } from "@/lib/db";
import { achievements, userAchievements } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allAchievements = await db.select().from(achievements);
    const unlocked = await db.select().from(userAchievements);

    const unlockedMap = new Map(
      unlocked.map((ua) => [ua.achievementId, ua.unlockedAt])
    );

    const result = allAchievements.map((a) => ({
      ...a,
      unlocked: unlockedMap.has(a.id),
      unlockedAt: unlockedMap.get(a.id) ?? null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
