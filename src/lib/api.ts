const BASE = "/api";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE}${url}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function mutate<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Categories
export const getCategories = () => fetcher<any[]>("/categories");

// Goals
export const getGoals = (year?: number) =>
  fetcher<any[]>(`/goals${year ? `?year=${year}` : ""}`);
export const createGoal = (data: any) => mutate<any>("/goals", "POST", data);
export const updateGoal = (id: number, data: any) => mutate<any>(`/goals/${id}`, "PATCH", data);
export const deleteGoal = (id: number) => mutate<any>(`/goals/${id}`, "DELETE");

// Daily Habits
export const getDailyHabits = (month: number, year?: number) =>
  fetcher<any>(`/habits/daily?month=${month}${year ? `&year=${year}` : ""}`);
export const createDailyHabit = (data: any) => mutate<any>("/habits/daily", "POST", data);
export const updateDailyHabit = (id: number, data: any) => mutate<any>(`/habits/daily/${id}`, "PATCH", data);
export const deleteDailyHabit = (id: number) => mutate<any>(`/habits/daily/${id}`, "DELETE");
export const toggleDailyEntry = (id: number, data: { date: string; completed: boolean }) =>
  mutate<any>(`/habits/daily/${id}/entries`, "PUT", data);

// Weekly Habits
export const getWeeklyHabits = (month: number, year?: number) =>
  fetcher<any>(`/habits/weekly?month=${month}${year ? `&year=${year}` : ""}`);
export const createWeeklyHabit = (data: any) => mutate<any>("/habits/weekly", "POST", data);
export const updateWeeklyHabit = (id: number, data: any) => mutate<any>(`/habits/weekly/${id}`, "PATCH", data);
export const deleteWeeklyHabit = (id: number) => mutate<any>(`/habits/weekly/${id}`, "DELETE");
export const toggleWeeklyEntry = (id: number, data: { week: number; completed: boolean }) =>
  mutate<any>(`/habits/weekly/${id}/entries`, "PUT", data);

// Stats
export const getYearStats = (year?: number) =>
  fetcher<any>(`/stats/year${year ? `?year=${year}` : ""}`);
export const getMonthStats = (month: number, year?: number) =>
  fetcher<any>(`/stats/month/${month}${year ? `?year=${year}` : ""}`);

// Habit Templates
export const getHabitTemplates = () => fetcher<any[]>("/habit-templates");
export const createHabitTemplate = (data: any) => mutate<any>("/habit-templates", "POST", data);
export const updateHabitTemplate = (id: number, data: any) => mutate<any>(`/habit-templates/${id}`, "PATCH", data);
export const deleteHabitTemplate = (id: number) => mutate<any>(`/habit-templates/${id}`, "DELETE");

// Life Goals
export const getLifeGoals = () => fetcher<any[]>("/life-goals");
export const createLifeGoal = (data: any) => mutate<any>("/life-goals", "POST", data);
export const updateLifeGoal = (id: number, data: any) => mutate<any>(`/life-goals/${id}`, "PATCH", data);
export const deleteLifeGoal = (id: number) => mutate<any>(`/life-goals/${id}`, "DELETE");

// Month Focus
export const getMonthFocus = (month: number, year?: number) =>
  fetcher<any[]>(`/month-focus?month=${month}${year ? `&year=${year}` : ""}`);
export const createMonthFocusItem = (data: any) => mutate<any>("/month-focus", "POST", data);
export const updateMonthFocusItem = (id: number, data: any) => mutate<any>(`/month-focus/${id}`, "PATCH", data);
export const deleteMonthFocusItem = (id: number) => mutate<any>(`/month-focus/${id}`, "DELETE");

// Routines
export const getRoutines = () => fetcher<any[]>("/routines");
export const createRoutine = (data: any) => mutate<any>("/routines", "POST", data);
export const updateRoutine = (id: number, data: any) => mutate<any>(`/routines/${id}`, "PATCH", data);
export const deleteRoutine = (id: number) => mutate<any>(`/routines/${id}`, "DELETE");

// Weekly Plans
export const getWeeklyPlan = (week: number, year?: number) =>
  fetcher<any>(`/weekly-plans?week=${week}${year ? `&year=${year}` : ""}`);
export const createWeeklyPlan = (data: any) => mutate<any>("/weekly-plans", "POST", data);
export const updateWeeklyPlan = (id: number, data: any) => mutate<any>(`/weekly-plans/${id}`, "PATCH", data);
export const deleteWeeklyPlan = (id: number) => mutate<any>(`/weekly-plans/${id}`, "DELETE");

// Reviews
export const getReviews = (params?: { year?: number; week?: number; month?: number; type?: string }) => {
  const qs = new URLSearchParams();
  if (params?.year) qs.set("year", String(params.year));
  if (params?.week) qs.set("week", String(params.week));
  if (params?.month) qs.set("month", String(params.month));
  if (params?.type) qs.set("type", params.type);
  return fetcher<any[]>(`/reviews?${qs.toString()}`);
};
export const createReview = (data: any) => mutate<any>("/reviews", "POST", data);
export const updateReview = (id: number, data: any) => mutate<any>(`/reviews/${id}`, "PATCH", data);
export const deleteReview = (id: number) => mutate<any>(`/reviews/${id}`, "DELETE");

// Energy
export const getEnergy = (date: string) => fetcher<any>(`/energy?date=${date}`);
export const getEnergyRange = (startDate: string, endDate: string) =>
  fetcher<any[]>(`/energy?start=${startDate}&end=${endDate}`);
export const upsertEnergy = (data: any) => mutate<any>("/energy", "PUT", data);

// Wheel of Life
export const getWheel = (year: number, month: number) =>
  fetcher<any[]>(`/wheel?year=${year}&month=${month}`);
export const getWheelYear = (year: number) => fetcher<any[]>(`/wheel?year=${year}`);
export const saveWheel = (data: any) => mutate<any>("/wheel", "POST", data);

// Achievements
export const getAchievements = () => fetcher<any[]>("/achievements");
export const checkAchievements = () => mutate<any>("/achievements/check", "POST");

// XP
export const getXp = () => fetcher<any>("/xp");
export const awardXp = (data: any) => mutate<any>("/xp", "POST", data);

// Analytics
export const getHeatmap = (year?: number) =>
  fetcher<any[]>(`/analytics/heatmap${year ? `?year=${year}` : ""}`);
export const getTrends = (year?: number) =>
  fetcher<any[]>(`/analytics/trends${year ? `?year=${year}` : ""}`);
export const getDayStats = (year?: number) =>
  fetcher<any[]>(`/analytics/days${year ? `?year=${year}` : ""}`);
export const getEnergyCorrelation = (year?: number) =>
  fetcher<any[]>(`/analytics/energy-correlation${year ? `?year=${year}` : ""}`);

// Quarter Themes
export const getQuarterThemes = (year?: number) =>
  fetcher<any[]>(`/quarter-themes${year ? `?year=${year}` : ""}`);
export const upsertQuarterTheme = (data: any) => mutate<any>("/quarter-themes", "POST", data);
