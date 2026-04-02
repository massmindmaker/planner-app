export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`rounded-xl border p-4 space-y-3 ${className ?? ""}`}>
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-8 w-full rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 7 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2">
          <div className="skeleton h-6 w-24 rounded" />
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton h-6 w-6 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}
