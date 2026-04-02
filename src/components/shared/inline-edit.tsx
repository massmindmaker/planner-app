"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function InlineEdit({ value, onSave, placeholder, className }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setText(value); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const save = () => {
    setEditing(false);
    if (text.trim() !== value) onSave(text.trim());
  };

  if (!editing) {
    return (
      <span
        onClick={() => setEditing(true)}
        className={`cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1 transition-colors ${className ?? ""}`}
      >
        {value || <span className="text-muted-foreground italic">{placeholder ?? "Нажмите для редактирования"}</span>}
      </span>
    );
  }

  return (
    <Input
      ref={inputRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") { setText(value); setEditing(false); }
      }}
      className={`h-7 px-1 ${className ?? ""}`}
      placeholder={placeholder}
    />
  );
}
