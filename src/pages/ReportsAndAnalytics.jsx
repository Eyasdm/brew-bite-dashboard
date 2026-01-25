import { useMemo, useState } from "react";
import SelectMenu from "../components/SelectMenu";

import { useReportsData } from "../hooks/useReportsData";
import { useProductsData } from "../hooks/useProductData";

import {
  buildStats,
  buildDailyOrdersData,
  buildRevenueTrendData,
  buildPeakHoursData,
} from "../utils/reports.aggregations";

import ReportsStats from "../components/reports/ReportsStats";
import ReportsCharts from "../components/charts/ReportsCharts";
import ReportsTabs from "../components/reports/ReportsTabs";

/* ------------------ constants ------------------ */
const RANGE_OPTIONS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

const TABS = {
  OVERVIEW: "overview",
};

export default function ReportsAndAnalytics() {
  /* ------------------ UI state ------------------ */
  const [range, setRange] = useState("all");
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

  /* ------------------ data ------------------ */
  const { orders, loading: ordersLoading } = useReportsData(range);
  const { items, loading: productsLoading } = useProductsData(range);

  const loading = ordersLoading || productsLoading;

  /* ------------------ aggregations ------------------ */
  const stats = useMemo(() => buildStats(orders), [orders]);
  const dailyOrdersData = useMemo(() => buildDailyOrdersData(orders), [orders]);
  const revenueTrendData = useMemo(
    () => buildRevenueTrendData(orders),
    [orders],
  );
  const peakHoursData = useMemo(() => buildPeakHoursData(orders), [orders]);

  /* =====================================================
   * Render
   * =================================================== */
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reports & Analytics</h1>

        <SelectMenu value={range} onChange={setRange} options={RANGE_OPTIONS} />
      </header>

      {/* Stats */}
      <ReportsStats stats={stats} loading={loading} />

      {/* Tabs */}
      <ReportsTabs value={activeTab} onChange={setActiveTab} />

      {/* Charts */}
      <ReportsCharts
        tab={activeTab}
        orders={orders}
        items={items}
        dailyOrdersData={dailyOrdersData}
        revenueTrendData={revenueTrendData}
        peakHoursData={peakHoursData}
        loading={loading}
      />
    </div>
  );
}
