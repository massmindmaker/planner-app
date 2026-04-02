"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { checkAchievements } from "@/lib/api";
import { useYear } from "@/contexts/year-context";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: api.getCategories });
}

export function useGoals(year?: number) {
  const { year: contextYear } = useYear();
  const resolvedYear = year ?? contextYear;
  return useQuery({ queryKey: ["goals", resolvedYear], queryFn: () => api.getGoals(resolvedYear) });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createGoal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateGoal(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["goals"] });
      if (variables.data?.completed !== undefined) {
        checkAchievements(); // fire and forget
      }
    },
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteGoal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}
