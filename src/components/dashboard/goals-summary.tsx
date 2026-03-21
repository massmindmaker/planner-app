"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Target, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface GoalsSummaryProps {
  total: number;
  completed: number;
}

function CountUp({ target }: { target: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
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

  return <>{value}</>;
}

function MiniRing({ completed, total }: { completed: number; total: number }) {
  const size = 40;
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? completed / total : 0;
  const offset = circumference - ratio * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-muted/20"
        strokeWidth={3}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#22c55e"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.5 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24, delay: i * 0.15 },
  }),
};

const pulseAnimation = {
  scale: [1, 1.15, 1],
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
};

export function GoalsSummary({ total, completed }: GoalsSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="flex items-center gap-3 p-4">
            <motion.div animate={pulseAnimation}>
              <Target className="h-8 w-8 text-blue-500" />
            </motion.div>
            <div className="flex-1">
              <p className="text-2xl font-bold">
                <CountUp target={total} />
              </p>
              <p className="text-xs text-muted-foreground">Всего целей</p>
            </div>
            <MiniRing completed={completed} total={total} />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="flex items-center gap-3 p-4">
            <motion.div animate={pulseAnimation}>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </motion.div>
            <div>
              <p className="text-2xl font-bold">
                <CountUp target={completed} />
              </p>
              <p className="text-xs text-muted-foreground">Выполнено</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
