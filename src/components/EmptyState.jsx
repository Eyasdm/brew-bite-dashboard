import { BarChart3 } from "lucide-react";

export default function EmptyState({
  title = "No data available",
  description = "There is no data for the selected period.",
}) {
  return (
    <div className="flex flex-col items-center justify-center h-80 rounded-2xl border border-dashed border-border bg-card text-center px-6">
      <div className="h-12 w-12 rounded-full bg-muted grid place-items-center mb-4">
        <BarChart3 className="h-6 w-6 text-text-muted" />
      </div>

      <h3 className="text-sm font-semibold text-text">{title}</h3>

      <p className="mt-1 text-sm text-text-muted">{description}</p>
    </div>
  );
}
