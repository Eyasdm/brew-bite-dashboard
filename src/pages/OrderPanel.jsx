import {
  CheckCircle2,
  Clock3,
  Coffee,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import OrderCard from "../components/OrderCard";
import StatCard from "../components/StatCard";
import SelectMenu from "../components/SelectMenu";
import {
  getOrderSortOptions,
  getOrderStatusOptions,
} from "../constants/filters.constants";
import { useOrderPanel } from "../hooks/useOrderPanel";

export default function OrderPanel() {
  const { t } = useTranslation();

  /* ------------------ filters ------------------ */
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  /* ------------------ data ------------------ */
  const { orders, isLoading, isError, error, refetch, updateStatus, updating } =
    useOrderPanel();

  /* ------------------ time label ------------------ */
  const nowLabel = useMemo(
    () =>
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  /* ------------------ stats ------------------ */
  const stats = useMemo(() => {
    const preparing = orders.filter((o) => o.status === "preparing").length;
    const ready = orders.filter((o) => o.status === "ready").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;

    return {
      preparing,
      ready,
      delivered,
      total: orders.length,
    };
  }, [orders]);

  /* ------------------ filtering ------------------ */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = [...orders];

    if (status !== "all") {
      data = data.filter((o) => o.status === status);
    }

    if (q) {
      data = data.filter((o) => {
        const itemsText = o.items?.map((i) => i.title).join(" ");

        const haystack = [
          o.orderNo,
          o.customerName,
          o.customerPhone,
          o.type,
          itemsText,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      });
    }

    data.sort((a, b) => {
      const diff = a.createdAt - b.createdAt;
      return sort === "newest" ? -diff : diff;
    });

    return data;
  }, [orders, query, status, sort]);

  /* ------------------ handlers ------------------ */
  async function handleChangeStatus(id, nextStatus) {
    try {
      await updateStatus({ id, status: nextStatus });
    } catch {
      // error handled by react-query rollback
    }
  }

  /* =====================================================
   * Render
   * =================================================== */
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">{t("ordersPanel.title")}</h1>
          <p className="text-sm text-text-muted">
            {nowLabel} • {t("ordersPanel.today")}: {stats.total}
          </p>

          {isError && (
            <p className="mt-1 text-sm text-red-600">
              {error?.message || t("orders.errors.loadFailed")}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={refetch}
          className="h-9 w-9 grid place-items-center rounded-xl border bg-card text-text-muted hover:bg-muted transition"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("orders.status.preparing")}
          value={stats.preparing}
          icon={Clock3}
          iconClassName="bg-primary-soft text-primary"
        />
        <StatCard
          title={t("orders.status.ready")}
          value={stats.ready}
          icon={CheckCircle2}
          iconClassName="bg-success-soft text-success"
        />
        <StatCard
          title={t("orders.status.delivered")}
          value={stats.delivered}
          icon={Truck}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatCard
          title={t("ordersPanel.total")}
          value={stats.total}
          icon={Coffee}
          iconClassName="bg-primary-soft text-primary"
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border bg-card p-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("ordersPanel.search")}
              className="h-11 w-full rounded-xl border bg-bg pl-10 pr-3 text-sm outline-none"
            />
          </div>

          <SelectMenu
            value={status}
            onChange={setStatus}
            options={getOrderStatusOptions(t)}
          />

          <SelectMenu
            value={sort}
            onChange={setSort}
            options={getOrderSortOptions(t)}
          />
        </div>
      </div>

      {/* Orders */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {isLoading ? (
          <div className="lg:col-span-2 rounded-2xl border bg-card p-10 text-center text-sm">
            {t("ordersPanel.loading")}
          </div>
        ) : (
          <>
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                loading={updating}
                onChangeStatus={handleChangeStatus}
              />
            ))}

            {!filtered.length && (
              <div className="lg:col-span-2 rounded-2xl border bg-card p-10 text-center">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-muted grid place-items-center">
                  <Coffee className="h-6 w-6 text-text-muted" />
                </div>
                <p className="mt-3 text-sm text-text-muted">
                  {t("ordersPanel.empty")}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
