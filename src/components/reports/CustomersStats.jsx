import { buildCustomerStats } from "../../utils/reports.aggregations";

export default function CustomersStats({ orders }) {
  const { avgOrdersPerCustomer, returningRate, satisfaction } =
    buildCustomerStats(orders);

  return (
    <div className="rounded-2xl border bg-card p-6">
      <h3 className="mb-6 text-sm font-medium">Customer Analytics</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-3xl font-semibold text-blue-600">
            {avgOrdersPerCustomer.toFixed(1)}
          </div>
          <div className="text-xs text-text-muted">Avg Orders / Customer</div>
        </div>

        <div>
          <div className="text-3xl font-semibold text-green-600">
            {returningRate}%
          </div>
          <div className="text-xs text-text-muted">Returning Orders</div>
        </div>

        <div>
          <div className="text-3xl font-semibold text-orange-600">
            {satisfaction}
          </div>
          <div className="text-xs text-text-muted">Avg Rating</div>
        </div>
      </div>
    </div>
  );
}
