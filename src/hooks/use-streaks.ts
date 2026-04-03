"use client";
import { useQuery } from "@tanstack/react-query";

const fetcher = async () => {
  const res = await fetch("/api/streaks");
  if (!res.ok) throw new Error("Failed to fetch streaks");
  return res.json();
};

export function useStreaks() {
  return useQuery({ queryKey: ["streaks"], queryFn: fetcher });
}
