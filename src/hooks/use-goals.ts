"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { checkAchievements } from "@/lib/api";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: api.getCategories });
}

export function useGoals(year?: number) {
  return useQuery({ queryKey: ["goals", year], queryFn: () => api.getGoals(year) });
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
