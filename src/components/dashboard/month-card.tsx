"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MONTH_NAMES } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface MonthCardProps {
  month: number;
  progress: number;
  totalHabits: number;
}

export function MonthCard({ month, progress, totalHabits }: MonthCardProps) {
  const data = [
    { value: progress },
    { value: 100 - progress },
  ];
  const color = progress === 0 ? "#e5e7eb" : progress < 50 ? "#f59e0b" : "#22c55e";

  return (
    <Link href={`/month/${month}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="flex flex-col items-center gap-2 p-4">
          <p className="text-sm font-medium">{MONTH_NAMES[month - 1]}</p>
          <div className="h-20 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={35}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill={color} />
                  <Cell fill="#f3f4f6" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-lg font-bold">{progress}%</p>
          <p className="text-xs text-muted-foreground">
            {totalHabits} {totalHabits === 1 ? "привычка" : "привычек"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
