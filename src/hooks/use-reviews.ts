"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useReviews(params?: { year?: number; week?: number; month?: number; type?: string }) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => api.getReviews(params),
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createReview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateReview(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteReview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
