"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useWheel(year: number, month: number) {
  return useQuery({
    queryKey: ["wheel", year, month],
    queryFn: () => api.getWheel(year, month),
  });
}

export function useWheelYear(year: number) {
  return useQuery({
    queryKey: ["wheel", year],
    queryFn: () => api.getWheelYear(year),
  });
}

export function useSaveWheel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.saveWheel,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wheel"] }),
  });
}
