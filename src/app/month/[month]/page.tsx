"use client";
import { use } from "react";
import { redirect } from "next/navigation";
import { MonthHeader } from "@/components/month/month-header";
import { DailyHabitsTable } from "@/components/month/daily-habits-table";
import { WeeklyHabitsTable } from "@/components/month/weekly-habits-table";

export default function MonthPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month: monthStr } = use(params);
  const month = Number(monthStr);

  if (isNaN(month) || month < 1 || month > 12) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <MonthHeader month={month} />
      <DailyHabitsTable month={month} />
      <WeeklyHabitsTable month={month} />
    </div>
  );
}
