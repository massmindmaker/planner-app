import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  boolean,
  date,
  unique,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const yearlyGoals = pgTable("yearly_goals", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  year: integer("year").notNull().default(2026),
  position: integer("position").notNull(),
  title: text("title").notNull().default(""),
  completed: boolean("completed").notNull().default(false),
  dailyHabit: text("daily_habit"),
  weeklyHabit: text("weekly_habit"),
  monthlyHabit: text("monthly_habit"),
});

export const dailyHabits = pgTable("daily_habits", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull().default(2026),
  month: integer("month").notNull(),
  name: text("name").notNull(),
  position: integer("position").notNull(),
  goal: integer("goal"),
});

export const dailyHabitEntries = pgTable(
  "daily_habit_entries",
  {
    id: serial("id").primaryKey(),
    habitId: integer("habit_id")
      .references(() => dailyHabits.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    completed: boolean("completed").notNull().default(false),
  },
  (t) => [unique().on(t.habitId, t.date)]
);

export const weeklyHabits = pgTable("weekly_habits", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull().default(2026),
  month: integer("month").notNull(),
  name: text("name").notNull(),
  position: integer("position").notNull(),
});

export const weeklyHabitEntries = pgTable(
  "weekly_habit_entries",
  {
    id: serial("id").primaryKey(),
    habitId: integer("habit_id")
      .references(() => weeklyHabits.id, { onDelete: "cascade" })
      .notNull(),
    week: integer("week").notNull(),
    completed: boolean("completed").notNull().default(false),
  },
  (t) => [unique().on(t.habitId, t.week)]
);
