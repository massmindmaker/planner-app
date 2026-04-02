"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useQuarterThemes(year?: number) {
  return useQuery({
    queryKey: ["quarterThemes", year],
    queryFn: () => api.getQuarterThemes(year),
  });
}

export function useUpsertQuarterTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.upsertQuarterTheme,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quarterThemes"] }),
  });
}
