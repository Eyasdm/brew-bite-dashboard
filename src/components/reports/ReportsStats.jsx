import { DollarSign, ShoppingCart, UserCheck, Users } from "lucide-react";
import StatCard from "../StatCard";
import { fetchActiveStaffCount } from "../../services/users";
import { useEffect, useState } from "react";

export default function ReportsStats({ stats, loading }) {
  const [activeStaff, setActiveStaff] = useState(0);

  useEffect(() => {
    async function loadStaff() {
      try {
        const count = await fetchActiveStaffCount();
        setActiveStaff(count);
      } catch (e) {
        console.error("Failed to load active staff", e);
      }
    }

    loadStaff();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toFixed(2)}`}
        icon={DollarSign}
        iconClassName="bg-green-100 text-green-600"
      />

      <StatCard
        title="Total Orders"
        value={stats.totalOrders}
        icon={ShoppingCart}
        iconClassName="bg-blue-100 text-blue-600"
      />

      <StatCard
        title="Avg Order Value"
        value={`$${stats.avgOrder.toFixed(2)}`}
        icon={DollarSign}
        iconClassName="bg-orange-100 text-orange-600"
      />

      <StatCard
        title="Active Staff"
        value={activeStaff}
        icon={UserCheck}
        iconClassName="bg-purple-100 text-purple-600"
      />
    </div>
  );
}
