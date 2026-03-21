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
