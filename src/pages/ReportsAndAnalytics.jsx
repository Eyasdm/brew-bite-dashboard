import { useMemo, useState } from "react";
import SelectMenu from "../components/SelectMenu";

import { useReportsData } from "../hooks/useReportsData";

import {
  buildStats,
  buildDailyOrdersData,
  buildRevenueTrendData,
  buildPeakHoursData,
} from "../utils/reports.aggregations";

import ReportsStats from "../components/reports/ReportsStats";
import ReportsCharts from "../components/charts/ReportsCharts";
import ReportsTabs from "../components/reports/ReportsTabs";
import { useProductsData } from "../hooks/useProductData";

const DEURATION_OPTIONS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

export default function ReportsAndAnalytics() {
  const [range, setRange] = useState("all");
  const [tab, setTab] = useState("overview");
  const { items, loading: productsLoading } = useProductsData(range);

  const { orders, loading } = useReportsData(range);

  const stats = useMemo(() => buildStats(orders), [orders]);
  const dailyOrdersData = useMemo(() => buildDailyOrdersData(orders), [orders]);
  const revenueTrendData = useMemo(
    () => buildRevenueTrendData(orders),
    [orders]
  );
  const peakHoursData = useMemo(() => buildPeakHoursData(orders), [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">Reports & Analytics</h1>

        <SelectMenu
          value={range}
          onChange={setRange}
          options={DEURATION_OPTIONS}
        />
      </div>

      {/* Stats */}
      <ReportsStats stats={stats} loading={loading} />
      <ReportsTabs value={tab} onChange={setTab} />

      {/* Charts */}
      <ReportsCharts
        tab={tab}
        orders={orders}
        items={items}
        dailyOrdersData={dailyOrdersData}
        revenueTrendData={revenueTrendData}
        peakHoursData={peakHoursData}
        loading={loading || productsLoading}
      />
    </div>
  );
}
