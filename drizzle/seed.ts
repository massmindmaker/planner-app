import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories } from "../src/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  await db.insert(categories).values([
    { name: "Карьера", icon: "briefcase", sortOrder: 1 },
    { name: "Финансы", icon: "wallet", sortOrder: 2 },
    { name: "Творчество", icon: "palette", sortOrder: 3 },
    { name: "Личное развитие", icon: "book-open", sortOrder: 4 },
    { name: "Взаимоотношения", icon: "heart", sortOrder: 5 },
    { name: "Духовность", icon: "sparkles", sortOrder: 6 },
  ]);
  console.log("Seeded 6 categories");
}

seed().catch(console.error);
