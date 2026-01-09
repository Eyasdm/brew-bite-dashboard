import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

export default function DailyOrdersRevenueChart({ data }) {
  return (
    <div className="h-80 rounded-2xl border border-border bg-card p-4 flex flex-col">
      <h3 className="mb-4 text-sm font-medium text-text">
        Daily Orders & Revenue
      </h3>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<ChartTooltip type="currency" />} />

            <Bar
              yAxisId="left"
              dataKey="orders"
              fill="#fb923c"
              radius={[6, 6, 0, 0]}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={3}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
