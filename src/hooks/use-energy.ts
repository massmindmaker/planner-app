"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useEnergy(date: string) {
  return useQuery({
    queryKey: ["energy", date],
    queryFn: () => api.getEnergy(date),
  });
}

export function useUpsertEnergy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.upsertEnergy,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["energy"] }),
  });
}
