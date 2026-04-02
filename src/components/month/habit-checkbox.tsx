"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HabitCheckboxProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  /** When true, a checked state means a failure (shown in red) */
  isNegative?: boolean;
  /** When true, shows an amber/yellow half-filled state (minimum version completed) */
  isMinimum?: boolean;
}

export function HabitCheckbox({ checked, onToggle, isNegative = false, isMinimum = false }: HabitCheckboxProps) {
  const [optimistic, setOptimistic] = useState(checked);
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    setOptimistic(checked);
  }, [checked]);

  const handleChange = () => {
    const next = !optimistic;
    setOptimistic(next);
    onToggle(next);
    if (next && !isNegative) {
      setRipple(true);
      setTimeout(() => setRipple(false), 500);
    }
  };

  // Colors: minimum = amber, positive = green, negative = red
  const checkedColor = isMinimum && optimistic
    ? "rgb(245 158 11)"
    : isNegative
    ? "rgb(239 68 68)"
    : "rgb(34 197 94)";
  const rippleColor = isMinimum && optimistic
    ? "bg-amber-400/30"
    : isNegative
    ? "bg-red-400/30"
    : "bg-green-400/30";

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
            className={`absolute inset-0 rounded-md ${rippleColor}`}
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
            fill: optimistic ? checkedColor : "transparent",
            stroke: optimistic ? checkedColor : "rgb(161 161 170)",
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          strokeWidth="2"
        />

        {/* Positive non-minimum: full checkmark path */}
        {!isNegative && !isMinimum && (
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
        )}

        {/* Minimum state: half-check (short dash) */}
        {isMinimum && !isNegative && (
          <motion.path
            d="M7 12.5l3 3 3.5-3.5"
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
        )}

        {/* Negative: X mark */}
        {isNegative && (
          <>
            <motion.line
              x1="8" y1="8" x2="16" y2="16"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={false}
              animate={{
                pathLength: optimistic ? 1 : 0,
                opacity: optimistic ? 1 : 0,
              }}
              transition={{
                pathLength: { duration: 0.25, ease: "easeInOut", delay: optimistic ? 0.05 : 0 },
                opacity: { duration: 0.15 },
              }}
            />
            <motion.line
              x1="16" y1="8" x2="8" y2="16"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={false}
              animate={{
                pathLength: optimistic ? 1 : 0,
                opacity: optimistic ? 1 : 0,
              }}
              transition={{
                pathLength: { duration: 0.25, ease: "easeInOut", delay: optimistic ? 0.1 : 0 },
                opacity: { duration: 0.15 },
              }}
            />
          </>
        )}
      </motion.svg>
    </motion.button>
  );
}
