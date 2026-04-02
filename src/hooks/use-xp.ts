"use client";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useXp() {
  return useQuery({ queryKey: ["xp"], queryFn: api.getXp });
}
