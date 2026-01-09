// The page should have dynamic data not mock data

import {
  CheckCircle2,
  Clock3,
  Coffee,
  RefreshCw,
  Search,
  Truck,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import OrderCard from "../components/OrderCard";
import StatCard from "../components/StatCard";
import SelectMenu from "../components/SelectMenu";
import { fetchOrders, updateOrderStatus } from "../services/orders";
import {
  getOrderSortOptions,
  getOrderStatusOptions,
} from "../constants/filters.constants";
import { loadWithState } from "../utils/loadWithState";
import { useTranslation } from "react-i18next";

export default function OrderPanel() {
  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  async function loadOrders() {
    await loadWithState({
      loader: fetchOrders,
      setData: setOrders,
      setLoading,
      setError: setErrMsg,
      errorMessage: t("orders.errors.loadFailed"),
    });
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function onChangeStatus(id, nextStatus) {
    const prev = orders;
    setOrders((p) =>
      p.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );

    try {
      await updateOrderStatus(id, nextStatus);
    } catch (e) {
      setOrders(prev);
      setErrMsg(e?.message || t("orders.errors.updateFailed"));
    }
  }

  const nowLabel = useMemo(() => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const stats = useMemo(() => {
    const preparing = orders.filter((o) => o.status === "preparing").length;
    const ready = orders.filter((o) => o.status === "ready").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return { preparing, ready, delivered, total: orders.length };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = [...orders];

    if (status !== "all") {
      data = data.filter((o) => o.status === status);
    }

    if (q) {
      data = data.filter((o) => {
        const itemsText = o.items?.map((i) => i.title).join(" ");
        const hay = [
          o.orderNo,
          o.customerName,
          o.customerPhone,
          o.type,
          itemsText,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return hay.includes(q);
      });
    }

    data.sort((a, b) => {
      const diff = a.createdAt - b.createdAt;
      return sort === "newest" ? -diff : diff;
    });

    return data;
  }, [orders, query, status, sort]);

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="rounded-2xl border border-border bg-card px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">
            {t("ordersPanel.title")}
          </h1>
          <p className="text-sm text-text-muted">
            {nowLabel} • {t("ordersPanel.today")}: {stats.total}
          </p>

          {errMsg ? (
            <p className="mt-1 text-sm text-red-600">{errMsg}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="h-9 w-9 grid place-items-center rounded-xl border border-border bg-card text-text-muted hover:bg-muted hover:text-text transition"
          aria-label={t("common.refresh")}
          title={t("common.refresh")}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* filters */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_220px] gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("ordersPanel.search")}
              className="h-11 w-full rounded-xl border border-border bg-bg pl-10 pr-3 text-sm text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <SelectMenu
            value={status}
            onChange={setStatus}
            options={getOrderStatusOptions(t)}
            minWidth={220}
          />
          <SelectMenu
            value={sort}
            onChange={setSort}
            options={getOrderSortOptions(t)}
            minWidth={220}
          />
        </div>
      </div>

      {/* orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-10 text-center text-sm text-text-muted">
            {t("ordersPanel.loading")}
          </div>
        ) : (
          <>
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onChangeStatus={onChangeStatus}
              />
            ))}

            {!filtered.length ? (
              <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-10 text-center">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-muted grid place-items-center">
                  <Coffee className="h-6 w-6 text-text-muted" />
                </div>
                <p className="mt-3 text-sm text-text-muted">
                  {t("ordersPanel.empty")}
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
