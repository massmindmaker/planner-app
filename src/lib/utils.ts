import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
] as const;

export const CURRENT_YEAR = new Date().getFullYear();

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getWeekNumber(year: number, month: number, day: number): number {
  const date = new Date(year, month - 1, day);
  const firstDay = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDay.getDay(); // 0=Sun
  return Math.ceil((day + firstDayOfWeek) / 7);
}

export function getDayOfWeek(year: number, month: number, day: number): string {
  const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  return days[new Date(year, month - 1, day).getDay()];
}
