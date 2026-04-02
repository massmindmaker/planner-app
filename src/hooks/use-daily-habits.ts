"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { checkAchievements } from "@/lib/api";

export function useDailyHabits(month: number, year?: number) {
  return useQuery({
    queryKey: ["dailyHabits", month, year],
    queryFn: () => api.getDailyHabits(month, year),
  });
}

export function useCreateDailyHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createDailyHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dailyHabits"] }),
  });
}

export function useUpdateDailyHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateDailyHabit(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dailyHabits"] }),
  });
}

export function useDeleteDailyHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteDailyHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dailyHabits"] }),
  });
}

export function useToggleDailyEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      date,
      completed,
      value,
      isMinimum,
    }: {
      id: number;
      date: string;
      completed: boolean;
      value?: number;
      isMinimum?: boolean;
    }) => api.toggleDailyEntry(id, { date, completed, value, isMinimum }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dailyHabits"] });
      qc.invalidateQueries({ queryKey: ["monthStats"] });
      checkAchievements(); // fire and forget
    },
  });
}
