"use client";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { useYear } from "@/contexts/year-context";

export function useYearStats(year?: number) {
  const { year: contextYear } = useYear();
  const resolvedYear = year ?? contextYear;
  return useQuery({
    queryKey: ["stats", "year", resolvedYear],
    queryFn: () => api.getYearStats(resolvedYear),
  });
}

export function useMonthStats(month: number, year?: number) {
  return useQuery({
    queryKey: ["stats", "month", month, year],
    queryFn: () => api.getMonthStats(month, year),
  });
}
