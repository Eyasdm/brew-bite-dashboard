import EmptyState from "../EmptyState";
import DailyOrdersRevenueChart from "./DailyOrdersRevenueChart";
import RevenueTrendChart from "./RevenueTrendChart";
import PeakHoursChart from "./PeakHoursChart";
import ProductsCharts from "./ProductsCharts";
import CustomersStats from "../reports/CustomersStats";
import PerformanceStats from "../reports/PerformanceStats";
import ChartErrorBoundary from "./ChartErrorBoundary";
import type { ReportOrder, OrderItemWithJoins } from "../../types";
import type {
  DailyOrdersDataPoint,
  RevenueTrendDataPoint,
  PeakHoursDataPoint,
} from "../../utils/reports.aggregations";

interface ReportsChartsProps {
  tab: string;
  orders: ReportOrder[];
  items: OrderItemWithJoins[];
  dailyOrdersData: DailyOrdersDataPoint[];
  revenueTrendData: RevenueTrendDataPoint[];
  peakHoursData: PeakHoursDataPoint[];
  loading: boolean;
}

export default function ReportsCharts(props: ReportsChartsProps) {
  const { tab, orders } = props;

  if (!orders.length) return <EmptyState />;

  switch (tab) {
    case "overview":
      return <OverviewCharts {...props} />;

    case "products":
      return (
        <ChartErrorBoundary key="products">
          <ProductsCharts items={props.items} />
        </ChartErrorBoundary>
      );

    case "customers":
      return (
        <ChartErrorBoundary key="customers">
          <CustomersStats orders={orders} />
        </ChartErrorBoundary>
      );

    case "performance":
      return (
        <ChartErrorBoundary key="performance">
          <PerformanceStats orders={orders} />
        </ChartErrorBoundary>
      );

    default:
      return <div>Coming soon</div>;
  }
}

interface OverviewChartsProps {
  dailyOrdersData: DailyOrdersDataPoint[];
  revenueTrendData: RevenueTrendDataPoint[];
  peakHoursData: PeakHoursDataPoint[];
}

function OverviewCharts({ dailyOrdersData, revenueTrendData, peakHoursData }: OverviewChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartErrorBoundary key="daily-orders">
        <DailyOrdersRevenueChart data={dailyOrdersData} />
      </ChartErrorBoundary>

      <ChartErrorBoundary key="revenue-trend">
        <RevenueTrendChart data={revenueTrendData} />
      </ChartErrorBoundary>

      <ChartErrorBoundary key="peak-hours">
        <PeakHoursChart data={peakHoursData} />
      </ChartErrorBoundary>
    </div>
  );
}
