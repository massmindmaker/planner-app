import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.sortOrder));
  return NextResponse.json(result);
}
