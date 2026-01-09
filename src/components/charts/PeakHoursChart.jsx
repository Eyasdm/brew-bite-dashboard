import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

export default function PeakHoursChart({ data }) {
  return (
    <div className="h-96 rounded-2xl border border-border bg-card p-4  flex flex-col">
      <h3 className="mb-4 text-sm font-medium text-text">
        Peak Hours Analysis
      </h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip content={<ChartTooltip type="currency" />} />
            <Bar dataKey="orders" fill="#fb923c" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
