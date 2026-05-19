import { DollarSign, ShoppingCart, UserCheck } from "lucide-react";
import StatCard from "../StatCard";
import { fetchActiveStaffCount } from "../../services/users";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ReportsStats({ stats, loading }) {
  const { t } = useTranslation();
  const { currency } = useCurrency();
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
        title={t("reports.stats.totalRevenue")}
        value={formatCurrency(stats.totalRevenue, currency)}
        icon={DollarSign}
        iconClassName="bg-green-100 text-green-600"
      />

      <StatCard
        title={t("reports.stats.totalOrders")}
        value={stats.totalOrders}
        icon={ShoppingCart}
        iconClassName="bg-blue-100 text-blue-600"
      />

      <StatCard
        title={t("reports.stats.avgOrder")}
        value={formatCurrency(stats.avgOrder, currency)}
        icon={DollarSign}
        iconClassName="bg-orange-100 text-orange-600"
      />

      <StatCard
        title={t("reports.stats.activeStaff")}
        value={activeStaff}
        icon={UserCheck}
        iconClassName="bg-purple-100 text-purple-600"
      />
    </div>
  );
}
