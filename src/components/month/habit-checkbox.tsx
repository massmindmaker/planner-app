"use client";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface HabitCheckboxProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

export function HabitCheckbox({ checked, onToggle }: HabitCheckboxProps) {
  const [optimistic, setOptimistic] = useState(checked);

  useEffect(() => {
    setOptimistic(checked);
  }, [checked]);

  const handleChange = (value: boolean) => {
    setOptimistic(value);
    onToggle(value);
  };

  return (
    <Checkbox
      checked={optimistic}
      onCheckedChange={handleChange}
      className="h-5 w-5"
    />
  );
}
