import { buildPerformanceStats } from "../../utils/reports.aggregations";

export default function PerformanceStats() {
  const { avgPrepTime, orderAccuracy, avgDeliveryTime, onTimeDelivery } =
    buildPerformanceStats();

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="mb-6 text-sm font-medium">Operational Metrics</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric
          value={`${avgPrepTime} min`}
          label="Avg Prep Time"
          color="text-green-600"
        />

        <Metric
          value={`${orderAccuracy}%`}
          label="Order Accuracy"
          color="text-blue-600"
        />

        <Metric
          value={`${avgDeliveryTime} min`}
          label="Avg Delivery Time"
          color="text-orange-600"
        />

        <Metric
          value={`${onTimeDelivery}%`}
          label="On-time Delivery"
          color="text-purple-600"
        />
      </div>
    </div>
  );
}

/* Inline KPI block */
function Metric({ value, label, color }) {
  return (
    <div className="rounded-xl border bg-card px-6 py-5 text-center">
      <div className={`text-2xl font-semibold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-text-muted">{label}</div>
    </div>
  );
}
