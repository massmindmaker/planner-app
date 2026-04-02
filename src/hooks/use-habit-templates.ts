"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useHabitTemplates() {
  return useQuery({ queryKey: ["habitTemplates"], queryFn: api.getHabitTemplates });
}

export function useCreateHabitTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createHabitTemplate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habitTemplates"] }),
  });
}

export function useUpdateHabitTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateHabitTemplate(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habitTemplates"] }),
  });
}

export function useDeleteHabitTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteHabitTemplate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habitTemplates"] }),
  });
}
