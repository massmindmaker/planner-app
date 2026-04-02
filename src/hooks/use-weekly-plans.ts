"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useWeeklyPlan(week: number, year?: number) {
  return useQuery({
    queryKey: ["weeklyPlan", week, year],
    queryFn: () => api.getWeeklyPlan(week, year),
  });
}

export function useCreateWeeklyPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createWeeklyPlan,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeklyPlan"] }),
  });
}

export function useUpdateWeeklyPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateWeeklyPlan(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeklyPlan"] }),
  });
}
