"use client";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useYearStats(year?: number) {
  return useQuery({
    queryKey: ["stats", "year", year],
    queryFn: () => api.getYearStats(year),
  });
}

export function useMonthStats(month: number, year?: number) {
  return useQuery({
    queryKey: ["stats", "month", month, year],
    queryFn: () => api.getMonthStats(month, year),
  });
}
