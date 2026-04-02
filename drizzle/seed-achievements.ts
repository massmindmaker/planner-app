import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const ACHIEVEMENTS = [
  { code: "first_habit", name: "Первый шаг", description: "Создай первую привычку", icon: "footprints", xpReward: 10 },
  { code: "first_goal", name: "Целеустремлённый", description: "Создай первую цель", icon: "target", xpReward: 10 },
  { code: "streak_7", name: "Неделя огня", description: "7 дней подряд без пропусков", icon: "flame", xpReward: 50 },
  { code: "streak_30", name: "Месяц силы", description: "30 дней подряд", icon: "zap", xpReward: 200 },
  { code: "streak_100", name: "Несокрушимый", description: "100 дней подряд", icon: "shield", xpReward: 500 },
  { code: "perfect_week", name: "Идеальная неделя", description: "100% привычек за неделю", icon: "star", xpReward: 100 },
  { code: "perfect_month", name: "Идеальный месяц", description: "100% привычек за месяц", icon: "crown", xpReward: 500 },
  { code: "first_review", name: "Рефлексия", description: "Напиши первый weekly review", icon: "book-open", xpReward: 30 },
  { code: "goal_complete", name: "Цель достигнута", description: "Выполни годовую цель", icon: "trophy", xpReward: 100 },
  { code: "all_month_focus", name: "Фокус месяца", description: "Выполни все задачи месяца", icon: "check-circle", xpReward: 150 },
  { code: "level_up", name: "Новый уровень", description: "Достигни уровня 2", icon: "arrow-up-circle", xpReward: 0 },
  { code: "routine_master", name: "Мастер рутины", description: "Выполни рутину 30 дней подряд", icon: "repeat", xpReward: 300 },
  { code: "clean_month", name: "Чистый месяц", description: "0 провалов за месяц (негативная привычка)", icon: "sparkles", xpReward: 200 },
  { code: "wheel_first", name: "Самопознание", description: "Заполни Колесо жизни", icon: "compass", xpReward: 20 },
  { code: "energy_week", name: "Энергичная неделя", description: "Логируй энергию 7 дней подряд", icon: "battery-charging", xpReward: 30 },
];

async function seed() {
  console.log("Seeding achievements...");
  for (const a of ACHIEVEMENTS) {
    await db.insert(schema.achievements).values(a).onConflictDoNothing({ target: schema.achievements.code });
  }
  console.log(`Seeded ${ACHIEVEMENTS.length} achievements.`);
}

seed().catch(console.error);
