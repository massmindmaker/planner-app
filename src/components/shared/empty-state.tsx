"use client";
import { motion } from "motion/react";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, href }: EmptyStateProps) {
  const content = (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && (onAction || href) && (
        href ? (
          <a
            href={href}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {actionLabel}
          </a>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {actionLabel}
          </button>
        )
      )}
    </motion.div>
  );

  return content;
}
