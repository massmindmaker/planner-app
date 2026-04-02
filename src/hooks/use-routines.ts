"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useRoutines() {
  return useQuery({ queryKey: ["routines"], queryFn: api.getRoutines });
}

export function useCreateRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createRoutine,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routines"] }),
  });
}

export function useUpdateRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateRoutine(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routines"] }),
  });
}

export function useDeleteRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteRoutine,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routines"] }),
  });
}
