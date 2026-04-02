import { z } from "zod";

export const createGoalSchema = z.object({
  categoryId: z.number().int().positive(),
  year: z.number().int().default(2026),
  position: z.number().int().min(1).max(8),
  title: z.string().default(""),
  dailyHabit: z.string().nullable().optional(),
  weeklyHabit: z.string().nullable().optional(),
  monthlyHabit: z.string().nullable().optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
  dailyHabit: z.string().nullable().optional(),
  weeklyHabit: z.string().nullable().optional(),
  monthlyHabit: z.string().nullable().optional(),
});

export const createDailyHabitSchema = z.object({
  year: z.number().int().default(2026),
  month: z.number().int().min(1).max(12),
  name: z.string().min(1),
  position: z.number().int(),
  goal: z.number().int().nullable().optional(),
});

export const updateDailyHabitSchema = z.object({
  name: z.string().min(1).optional(),
  goal: z.number().int().nullable().optional(),
  position: z.number().int().optional(),
});

export const toggleDailyEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  completed: z.boolean(),
});

export const createWeeklyHabitSchema = z.object({
  year: z.number().int().default(2026),
  month: z.number().int().min(1).max(12),
  name: z.string().min(1),
  position: z.number().int(),
});

export const updateWeeklyHabitSchema = z.object({
  name: z.string().min(1).optional(),
});

export const toggleWeeklyEntrySchema = z.object({
  week: z.number().int().min(1).max(5),
  completed: z.boolean(),
});

// Habit Templates
export const createHabitTemplateSchema = z.object({
  name: z.string().min(1),
  polarity: z.enum(["positive", "negative"]).default("positive"),
  habitType: z.enum(["boolean", "numeric", "weekly_target"]).default("boolean"),
  targetValue: z.number().int().positive().nullable().optional(),
  unit: z.string().nullable().optional(),
  minVersion: z.string().nullable().optional(),
  routineId: z.number().int().nullable().optional(),
  routineOrder: z.number().int().nullable().optional(),
});
export const updateHabitTemplateSchema = createHabitTemplateSchema.partial();

// Life Goals
export const createLifeGoalSchema = z.object({
  categoryId: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  position: z.number().int().default(0),
});
export const updateLifeGoalSchema = createLifeGoalSchema.partial();

// Month Focus
export const createMonthFocusSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  goalId: z.number().int().nullable().optional(),
  title: z.string().min(1),
  position: z.number().int().default(0),
});
export const updateMonthFocusSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
  goalId: z.number().int().nullable().optional(),
});

// Routines
export const createRoutineSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["morning", "evening", "custom"]).default("custom"),
});
export const updateRoutineSchema = createRoutineSchema.partial();

// Weekly Plans
export const createWeeklyPlanSchema = z.object({
  year: z.number().int(),
  week: z.number().int().min(1).max(53),
  focus: z.string().nullable().optional(),
});
export const updateWeeklyPlanSchema = z.object({
  focus: z.string().nullable().optional(),
});

// Reviews
export const createReviewSchema = z.object({
  year: z.number().int(),
  week: z.number().int().min(1).max(53).nullable().optional(),
  month: z.number().int().min(1).max(12).nullable().optional(),
  type: z.enum(["weekly", "monthly"]),
  wentWell: z.string().nullable().optional(),
  didntWork: z.string().nullable().optional(),
  nextFocus: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
});
export const updateReviewSchema = z.object({
  wentWell: z.string().nullable().optional(),
  didntWork: z.string().nullable().optional(),
  nextFocus: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
});

// Energy
export const upsertEnergySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  level: z.number().int().min(1).max(5),
});

// Wheel of Life
export const saveWheelSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  scores: z.array(z.object({
    categoryId: z.number().int(),
    score: z.number().int().min(1).max(10),
  })),
});

// Quarter Themes
export const upsertQuarterThemeSchema = z.object({
  year: z.number().int(),
  quarter: z.number().int().min(1).max(4),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
});

// Updated daily entry toggle (supports numeric + minimum)
export const toggleDailyEntrySchemaV2 = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  completed: z.boolean(),
  value: z.number().int().nullable().optional(),
  isMinimum: z.boolean().default(false),
});
