import { differenceInCalendarDays, parseISO, startOfDay } from "date-fns";

interface Entry {
  date: string;
  completed: boolean;
}

export function calculatePositiveStreak(entries: Entry[]): number {
  const today = startOfDay(new Date());
  const sorted = entries
    .filter((e) => e.completed)
    .map((e) => parseISO(e.date))
    .sort((a, b) => b.getTime() - a.getTime());

  if (sorted.length === 0) return 0;

  let streak = 0;
  let expected = today;

  for (const d of sorted) {
    const diff = differenceInCalendarDays(expected, d);
    if (diff === 0) {
      streak++;
      expected = new Date(expected.getTime() - 86400000);
    } else if (diff === 1 && streak === 0) {
      streak++;
      expected = new Date(d.getTime() - 86400000);
    } else {
      break;
    }
  }
  return streak;
}

export function calculateNegativeStreak(entries: Entry[], createdAt: Date): number {
  const today = startOfDay(new Date());
  const failures = entries
    .filter((e) => e.completed)
    .map((e) => parseISO(e.date))
    .sort((a, b) => b.getTime() - a.getTime());

  if (failures.length === 0) {
    return differenceInCalendarDays(today, startOfDay(createdAt));
  }
  return differenceInCalendarDays(today, failures[0]);
}
