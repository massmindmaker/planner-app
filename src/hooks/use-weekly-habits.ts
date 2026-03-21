"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useWeeklyHabits(month: number, year?: number) {
  return useQuery({
    queryKey: ["weeklyHabits", month, year],
    queryFn: () => api.getWeeklyHabits(month, year),
  });
}

export function useCreateWeeklyHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createWeeklyHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeklyHabits"] }),
  });
}

export function useUpdateWeeklyHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateWeeklyHabit(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeklyHabits"] }),
  });
}

export function useDeleteWeeklyHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteWeeklyHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["weeklyHabits"] }),
  });
}

export function useToggleWeeklyEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, week, completed }: { id: number; week: number; completed: boolean }) =>
      api.toggleWeeklyEntry(id, { week, completed }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["weeklyHabits"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
