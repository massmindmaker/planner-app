"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Target, CheckCircle2 } from "lucide-react";

interface GoalsSummaryProps {
  total: number;
  completed: number;
}

export function GoalsSummary({ total, completed }: GoalsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <Target className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Всего целей</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-2xl font-bold">{completed}</p>
            <p className="text-xs text-muted-foreground">Выполнено</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
