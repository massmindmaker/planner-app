"use client";
import { useEffect, useCallback } from "react";

interface UseHabitKeyboardOptions {
  onNewHabit: () => void;
  onToggleHelp: () => void;
}

/**
 * Keyboard shortcuts for the month/habit page.
 *
 * N          → open new habit dialog
 * ?          → toggle keyboard shortcuts help modal
 *
 * Arrow key navigation and Space/Enter toggling on checkboxes are handled
 * natively by the browser via tabIndex on the HabitCheckbox components.
 */
export function useHabitKeyboard({ onNewHabit, onToggleHelp }: UseHabitKeyboardOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip when focus is inside an input, textarea, or select
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable) {
        return;
      }
      // Skip when a dialog or modal is already open
      if (document.querySelector('[role="dialog"]')) {
        return;
      }

      switch (e.key) {
        case "n":
        case "N":
          e.preventDefault();
          onNewHabit();
          break;
        case "?":
          e.preventDefault();
          onToggleHelp();
          break;
        default:
          break;
      }
    },
    [onNewHabit, onToggleHelp]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
