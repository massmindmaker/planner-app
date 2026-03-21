"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES } from "@/lib/utils";
import { useMonthStats } from "@/hooks/use-stats";

interface MonthHeaderProps {
  month: number;
}

export function MonthHeader({ month }: MonthHeaderProps) {
  const { data: stats } = useMonthStats(month);
  const prevMonth = month > 1 ? month - 1 : 12;
  const nextMonth = month < 12 ? month + 1 : 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href={`/month/${prevMonth}`}>
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{MONTH_NAMES[month - 1]}</h1>
        <Link href={`/month/${nextMonth}`}>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats?.totalHabits ?? 0}</p>
            <p className="text-xs text-muted-foreground">Привычек</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats?.completedEntries ?? 0}</p>
            <p className="text-xs text-muted-foreground">Выполнено</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats?.progress ?? 0}%</p>
            <p className="text-xs text-muted-foreground">Прогресс</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
