"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useMonthFocus(month: number, year?: number) {
  return useQuery({
    queryKey: ["monthFocus", month, year],
    queryFn: () => api.getMonthFocus(month, year),
  });
}

export function useCreateMonthFocus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createMonthFocusItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["monthFocus"] }),
  });
}

export function useUpdateMonthFocus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateMonthFocusItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["monthFocus"] }),
  });
}

export function useDeleteMonthFocus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteMonthFocusItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["monthFocus"] }),
  });
}
