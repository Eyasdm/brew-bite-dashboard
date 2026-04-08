export function MenuCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-40 w-full bg-muted" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title + Price */}
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-4 w-12 rounded bg-muted" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-4/5 rounded bg-muted" />
        </div>

        {/* Category */}
        <div className="h-3 w-1/3 rounded bg-muted" />

        {/* Toggle + Actions */}
        <div className="flex items-center justify-between pt-2">
          {/* Toggle */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-9 rounded-full bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <div className="h-9 w-9 rounded-xl bg-muted" />
            <div className="h-9 w-9 rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
