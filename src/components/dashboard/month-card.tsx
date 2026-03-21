"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MONTH_NAMES } from "@/lib/utils";
import { motion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

interface MonthCardProps {
  month: number;
  progress: number;
  totalHabits: number;
}

function getProgressColor(progress: number): string {
  if (progress < 30) return "#ef4444";
  if (progress < 70) return "#f59e0b";
  return "#22c55e";
}

function getProgressGlow(progress: number): string {
  if (progress < 30) return "rgba(239,68,68,0.4)";
  if (progress < 70) return "rgba(245,158,11,0.4)";
  return "rgba(34,197,94,0.4)";
}

function AnimatedRing({ progress, size = 80 }: { progress: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getProgressColor(progress);
  const glow = getProgressGlow(progress);

  const springValue = useSpring(0, { stiffness: 80, damping: 20 });
  const strokeDashoffset = useTransform(
    springValue,
    (v: number) => circumference - (v / 100) * circumference
  );

  useEffect(() => {
    springValue.set(progress);
  }, [progress, springValue]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-muted/20"
        strokeWidth={6}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circumference}
        style={{ strokeDashoffset }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-[filter] duration-300"
      />
    </svg>
  );
}

function CountUp({ target }: { target: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 800;
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

export function MonthCard({ month, progress, totalHabits }: MonthCardProps) {
  return (
    <Link href={`/month/${month}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="group"
      >
        <Card className="cursor-pointer transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-primary/10 bg-gradient-to-br from-card to-card/80 border border-border/50 group-hover:border-primary/30">
          <CardContent className="flex flex-col items-center gap-2 p-4">
            <p className="text-sm font-medium">{MONTH_NAMES[month - 1]}</p>
            <div className="relative h-20 w-20 flex items-center justify-center">
              <AnimatedRing progress={progress} size={80} />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg font-bold">
                  <CountUp target={progress} />
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {totalHabits} {totalHabits === 1 ? "привычка" : "привычек"}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
