"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useAchievements() {
  return useQuery({ queryKey: ["achievements"], queryFn: api.getAchievements });
}

export function useCheckAchievements() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.checkAchievements,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["achievements"] }),
  });
}
