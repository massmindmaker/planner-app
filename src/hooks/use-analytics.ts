"use client";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useHeatmap(year?: number) {
  return useQuery({
    queryKey: ["analytics", "heatmap", year],
    queryFn: () => api.getHeatmap(year),
  });
}

export function useTrends(year?: number) {
  return useQuery({
    queryKey: ["analytics", "trends", year],
    queryFn: () => api.getTrends(year),
  });
}

export function useDayStats(year?: number) {
  return useQuery({
    queryKey: ["analytics", "days", year],
    queryFn: () => api.getDayStats(year),
  });
}

export function useEnergyCorrelation(year?: number) {
  return useQuery({
    queryKey: ["analytics", "energyCorrelation", year],
    queryFn: () => api.getEnergyCorrelation(year),
  });
}
