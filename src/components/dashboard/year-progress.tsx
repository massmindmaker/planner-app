"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface YearProgressProps {
  months: { month: number; progress: number }[];
}

export function YearProgress({ months }: YearProgressProps) {
  const avg = months.length
    ? Math.round(months.reduce((sum, m) => sum + m.progress, 0) / months.length)
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Прогресс за год</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Progress value={avg} className="flex-1" />
          <span className="text-2xl font-bold">{avg}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
