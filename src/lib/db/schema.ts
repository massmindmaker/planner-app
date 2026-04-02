import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  boolean,
  date,
  unique,
  timestamp,
} from "drizzle-orm/pg-core";

// ─── Base / no-dependency tables ────────────────────────────────────────────

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 10 }).notNull().default("custom"),
  position: integer("position").notNull().default(0),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  xpReward: integer("xp_reward").notNull().default(0),
});

// ─── Tables that depend only on base tables ──────────────────────────────────

export const habitTemplates = pgTable("habit_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  polarity: varchar("polarity", { length: 10 }).notNull().default("positive"),
  habitType: varchar("habit_type", { length: 15 }).notNull().default("boolean"),
  targetValue: integer("target_value"),
  unit: varchar("unit", { length: 30 }),
  minVersion: text("min_version"),
  routineId: integer("routine_id").references(() => routines.id, {
    onDelete: "set null",
  }),
  routineOrder: integer("routine_order"),
  position: integer("position").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lifeGoals = pgTable("life_goals", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Tables that depend on lifeGoals / habitTemplates ────────────────────────

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
  lifeGoalId: integer("life_goal_id").references(() => lifeGoals.id, {
    onDelete: "set null",
  }),
});

export const dailyHabits = pgTable("daily_habits", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull().default(2026),
  month: integer("month").notNull(),
  name: text("name").notNull(),
  position: integer("position").notNull(),
  goal: integer("goal"),
  templateId: integer("template_id").references(() => habitTemplates.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Tables that depend on yearlyGoals ───────────────────────────────────────

export const monthFocus = pgTable("month_focus", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  goalId: integer("goal_id").references(() => yearlyGoals.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  position: integer("position").notNull().default(0),
});

// ─── Tables that depend on dailyHabits ───────────────────────────────────────

export const dailyHabitEntries = pgTable(
  "daily_habit_entries",
  {
    id: serial("id").primaryKey(),
    habitId: integer("habit_id")
      .references(() => dailyHabits.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    completed: boolean("completed").notNull().default(false),
    value: integer("value"),
    isMinimum: boolean("is_minimum").notNull().default(false),
  },
  (t) => [unique().on(t.habitId, t.date)]
);

// ─── Weekly habits (no new deps) ─────────────────────────────────────────────

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

// ─── Standalone new tables ────────────────────────────────────────────────────

export const weeklyPlans = pgTable(
  "weekly_plans",
  {
    id: serial("id").primaryKey(),
    year: integer("year").notNull(),
    week: integer("week").notNull(),
    focus: text("focus"),
  },
  (t) => [unique().on(t.year, t.week)]
);

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
  week: integer("week"),
  month: integer("month"),
  type: varchar("type", { length: 10 }).notNull(),
  wentWell: text("went_well"),
  didntWork: text("didnt_work"),
  nextFocus: text("next_focus"),
  notes: text("notes"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const energyLogs = pgTable("energy_logs", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  level: integer("level").notNull(),
});

export const wheelOfLife = pgTable(
  "wheel_of_life",
  {
    id: serial("id").primaryKey(),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),
    score: integer("score").notNull(),
  },
  (t) => [unique().on(t.year, t.month, t.categoryId)]
);

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  achievementId: integer("achievement_id")
    .references(() => achievements.id)
    .notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const userXp = pgTable(
  "user_xp",
  {
    id: serial("id").primaryKey(),
    date: date("date").notNull(),
    xpGained: integer("xp_gained").notNull(),
    source: varchar("source", { length: 50 }).notNull(),
    sourceId: integer("source_id"),
  },
  (t) => [unique().on(t.date, t.source, t.sourceId)]
);

export const quarterThemes = pgTable(
  "quarter_themes",
  {
    id: serial("id").primaryKey(),
    year: integer("year").notNull(),
    quarter: integer("quarter").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
  },
  (t) => [unique().on(t.year, t.quarter)]
);
