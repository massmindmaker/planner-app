"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useLifeGoals() {
  return useQuery({ queryKey: ["lifeGoals"], queryFn: api.getLifeGoals });
}

export function useCreateLifeGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createLifeGoal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lifeGoals"] }),
  });
}

export function useUpdateLifeGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateLifeGoal(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lifeGoals"] }),
  });
}

export function useDeleteLifeGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteLifeGoal,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lifeGoals"] }),
  });
}
