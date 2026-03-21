"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface YearProgressProps {
  months: { month: number; progress: number }[];
}

function CountUp({ target }: { target: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const duration = 1000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [target]);

  return <>{value}%</>;
}

export function YearProgress({ months }: YearProgressProps) {
  const avg = months.length
    ? Math.round(months.reduce((sum, m) => sum + m.progress, 0) / months.length)
    : 0;

  const springWidth = useSpring(0, { stiffness: 60, damping: 20 });
  const widthPercent = useTransform(springWidth, (v: number) => `${v}%`);

  useEffect(() => {
    springWidth.set(avg);
  }, [avg, springWidth]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="text-base">Прогресс за год</CardTitle>
            {avg > 50 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 1 }}
              >
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </motion.div>
            )}
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                style={{ width: widthPercent }}
              />
            </div>
            <span className="text-2xl font-bold min-w-[3.5rem] text-right">
              <CountUp target={avg} />
            </span>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
