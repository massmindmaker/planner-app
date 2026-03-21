"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HabitCheckboxProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

export function HabitCheckbox({ checked, onToggle }: HabitCheckboxProps) {
  const [optimistic, setOptimistic] = useState(checked);
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    setOptimistic(checked);
  }, [checked]);

  const handleChange = () => {
    const next = !optimistic;
    setOptimistic(next);
    onToggle(next);
    if (next) {
      setRipple(true);
      setTimeout(() => setRipple(false), 500);
    }
  };

  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={optimistic}
      onClick={handleChange}
      whileTap={{ scale: 0.85 }}
      className="relative inline-flex items-center justify-center w-6 h-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-md"
    >
      {/* Ripple effect */}
      <AnimatePresence>
        {ripple && (
          <motion.span
            className="absolute inset-0 rounded-md bg-green-400/30"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Box */}
      <motion.svg
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none"
      >
        {/* Background fill */}
        <motion.rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="6"
          animate={{
            fill: optimistic ? "rgb(34 197 94)" : "transparent",
            stroke: optimistic ? "rgb(34 197 94)" : "rgb(161 161 170)",
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          strokeWidth="2"
        />

        {/* Checkmark path that draws itself */}
        <motion.path
          d="M7 12.5l3.5 3.5 6.5-7"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={false}
          animate={{
            pathLength: optimistic ? 1 : 0,
            opacity: optimistic ? 1 : 0,
          }}
          transition={{
            pathLength: { duration: 0.3, ease: "easeInOut", delay: optimistic ? 0.05 : 0 },
            opacity: { duration: 0.15 },
          }}
        />
      </motion.svg>
    </motion.button>
  );
}
