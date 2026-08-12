import { buildPerformanceStats } from "../../utils/reports.aggregations";
import type { ReportOrder } from "../../types";

interface PerformanceStatsProps {
  orders?: ReportOrder[];
}

export default function PerformanceStats({ orders = [] }: PerformanceStatsProps) {
  const { completionRate, cancellationRate, deliveryRate, totalDeliveries } =
    buildPerformanceStats(orders);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-6 text-sm font-medium">Operational Metrics</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric
          value={`${completionRate}%`}
          label="Completion Rate"
          color="text-green-600"
        />

        <Metric
          value={`${cancellationRate}%`}
          label="Cancellation Rate"
          color="text-red-500"
        />

        <Metric
          value={`${deliveryRate}%`}
          label="Delivery Orders"
          color="text-blue-600"
        />

        <Metric
          value={totalDeliveries}
          label="Total Deliveries"
          color="text-purple-600"
        />
      </div>
    </div>
  );
}

interface MetricProps {
  value: string | number;
  label: string;
  color: string;
}

function Metric({ value, label, color }: MetricProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-6 py-5 text-center">
      <div className={`text-2xl font-semibold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-text-muted">{label}</div>
    </div>
  );
}
