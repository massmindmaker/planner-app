import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function migrate() {
  console.log("Migrating existing habits to templates...");
  const habits = await db.select().from(schema.dailyHabits);
  const seen = new Map<string, number>();

  for (const habit of habits) {
    if (habit.templateId) continue;
    let templateId = seen.get(habit.name);
    if (!templateId) {
      const [template] = await db.insert(schema.habitTemplates).values({
        name: habit.name,
        polarity: "positive",
        habitType: "boolean",
        position: habit.position,
      }).returning({ id: schema.habitTemplates.id });
      templateId = template.id;
      seen.set(habit.name, templateId);
    }
    await db.update(schema.dailyHabits).set({ templateId }).where(eq(schema.dailyHabits.id, habit.id));
  }
  console.log(`Migrated ${habits.length} habits, created ${seen.size} templates.`);
}

migrate().catch(console.error);
