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
