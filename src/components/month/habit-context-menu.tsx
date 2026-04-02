"use client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface HabitContextMenuProps {
  children: React.ReactNode;
  hasMinVersion: boolean;
  onComplete: () => void;
  onMinimum: () => void;
  onClear: () => void;
}

export function HabitContextMenu({
  children,
  hasMinVersion,
  onComplete,
  onMinimum,
  onClear,
}: HabitContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onComplete}>
          ✓ Выполнено
        </ContextMenuItem>
        {hasMinVersion && (
          <ContextMenuItem onClick={onMinimum}>
            ½ Минимум
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onClear}>
          ✗ Не выполнено
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
