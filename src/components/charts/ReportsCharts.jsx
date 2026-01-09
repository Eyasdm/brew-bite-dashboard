import EmptyState from "../EmptyState";
import DailyOrdersRevenueChart from "./DailyOrdersRevenueChart";
import RevenueTrendChart from "./RevenueTrendChart";
import PeakHoursChart from "./PeakHoursChart";
import ProductsCharts from "./ProductsCharts";
import CustomersStats from "../reports/CustomersStats";
import PerformanceStats from "../reports/PerformanceStats";

export default function ReportsCharts(props) {
  const { tab, orders } = props;

  // if (loading) return <Skeleton />;

  if (!orders.length) return <EmptyState />;

  switch (tab) {
    case "overview":
      return <OverviewCharts {...props} />;

    case "products":
      return <ProductsCharts items={props.items} />;

    case "customers":
      return <CustomersStats orders={orders} />;

    case "performance":
      return <PerformanceStats />;

    default:
      return <div>Coming soon</div>;
  }
}

function OverviewCharts({ dailyOrdersData, revenueTrendData, peakHoursData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DailyOrdersRevenueChart data={dailyOrdersData} />
      <RevenueTrendChart data={revenueTrendData} />
      <PeakHoursChart data={peakHoursData} />
    </div>
  );
}
