"use client";
import { useStreaks } from "@/hooks/use-streaks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TopStreaks() {
  const { data, isLoading } = useStreaks();

  if (isLoading) return null;

  const top3 = (data ?? []).slice(0, 3);
  if (top3.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Лучшие серии</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {top3.map((item: any) => (
          <div key={item.templateId} className="flex items-center gap-2">
            <span className="text-base">🔥</span>
            <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
            <span className="text-sm font-bold text-orange-500">{item.streak}</span>
            <span className="text-xs text-muted-foreground">дн.</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
