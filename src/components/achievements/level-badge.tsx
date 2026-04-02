"use client";
import { motion } from "motion/react";

interface LevelBadgeProps {
  level: number;
  title: string;
}

export function LevelBadge({ level, title }: LevelBadgeProps) {
  return (
    <motion.div
      key={level}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
      className="flex flex-col items-center gap-1"
    >
      {/* Shield / hexagon-like shape using CSS clip-path */}
      <div
        className="relative flex h-20 w-20 items-center justify-center"
        style={{
          clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
        }}
      >
        <span className="text-white text-3xl font-extrabold leading-none select-none">
          {level}
        </span>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
          Уровень
        </p>
        <p className="text-base font-bold text-foreground">{title}</p>
      </div>
    </motion.div>
  );
}
