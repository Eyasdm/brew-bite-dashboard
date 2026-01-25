import { useMemo, useState } from "react";
import { Calendar, MoreHorizontal, Search as SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import SelectMenu from "../components/SelectMenu";
import {
  getOrderDateOptions,
  getOrderStatusOptions,
  getOrderTypeOptions,
} from "../constants/filters.constants";
import { formatMoney, getStartTimestamp } from "../utils/formaters";
import { useOrders } from "../hooks/useOrders";

/* ------------------ helpers ------------------ */
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------ badge ------------------ */
function Badge({ tone = "gray", children }) {
  const tones = {
    gray: "bg-muted text-text",
    yellow: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    green: "bg-green-100 text-green-800 border border-green-200",
    blue: "bg-blue-100 text-blue-800 border border-blue-200",
    red: "bg-red-100 text-red-800 border border-red-200",
  };

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ------------------ badge mappers ------------------ */
function getStatusBadge(status, t) {
  switch (status) {
    case "preparing":
      return { tone: "yellow", label: t("orders.status.preparing") };
    case "ready":
      return { tone: "green", label: t("orders.status.ready") };
    case "delivered":
      return { tone: "blue", label: t("orders.status.delivered") };
    case "cancelled":
      return { tone: "red", label: t("orders.status.cancelled") };
    default:
      return { tone: "gray", label: status };
  }
}

function getPaymentBadge(isPaid, t) {
  return isPaid
    ? { tone: "green", label: t("orders.payment.paid") }
    : { tone: "red", label: t("orders.payment.unpaid") };
}

/* =====================================================
 * Order Management Page
 * =================================================== */
export default function OrderManagement() {
  const { t } = useTranslation();

  /* ------------------ filters ------------------ */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [dateRange, setDateRange] = useState("7d");

  /* ------------------ data (React Query) ------------------ */
  const { data: orders = [], isLoading, isError, error } = useOrders();

  /* ------------------ filtering ------------------ */
  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    const startTime = getStartTimestamp(dateRange);

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.orderNo?.toLowerCase().includes(query) ||
        order.customerName?.toLowerCase().includes(query) ||
        order.itemTitle?.toLowerCase().includes(query);

      const matchesStatus = status === "all" || order.status === status;

      const matchesType = type === "all" || order.type === type;

      const matchesDate = !startTime || order.createdAt >= startTime;

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [orders, search, status, type, dateRange]);

  /* =====================================================
   * Render
   * =================================================== */
  return (
    <div className="max-w-full space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-xl font-semibold">{t("orders.title")}</h1>
        <p className="mt-1 text-sm text-text-muted">{t("orders.subtitle")}</p>
      </header>

      {/* Filters */}
      <section className="rounded-2xl border bg-card p-4">
        <div className="text-sm font-medium">{t("orders.filters")}</div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px_220px]">
          <div className="flex h-11 items-center gap-2 rounded-xl border bg-bg px-3">
            <SearchIcon className="h-4 w-4 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("orders.search")}
              className="h-full w-full bg-transparent text-sm outline-none"
            />
          </div>

          <SelectMenu
            value={status}
            onChange={setStatus}
            options={getOrderStatusOptions(t)}
          />

          <SelectMenu
            value={type}
            onChange={setType}
            options={getOrderTypeOptions(t)}
          />

          <div className="flex items-center gap-2">
            <SelectMenu
              value={dateRange}
              onChange={setDateRange}
              options={getOrderDateOptions(t)}
              className="flex-1"
            />

            <button
              type="button"
              className="h-11 w-11 inline-flex items-center justify-center rounded-xl border bg-bg hover:bg-muted transition"
            >
              <Calendar className="h-4 w-4 text-text-muted" />
            </button>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-4">
          <div className="text-sm font-medium">
            {t("orders.recent")} ({filteredOrders.length})
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="text-xs text-text-muted">
                <th className="px-4 py-3">{t("orders.table.order")}</th>
                <th className="px-4 py-3">{t("orders.table.customer")}</th>
                <th className="px-4 py-3">{t("orders.table.datetime")}</th>
                <th className="px-4 py-3">{t("orders.table.status")}</th>
                <th className="px-4 py-3">{t("orders.table.type")}</th>
                <th className="px-4 py-3">{t("orders.table.payment")}</th>
                <th className="px-4 py-3">{t("orders.table.total")}</th>
                <th className="px-4 py-3 text-right">
                  {t("orders.table.actions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm">
                    {t("orders.loading")}
                  </td>
                </tr>
              )}

              {!isLoading &&
                filteredOrders.map((order) => {
                  const s = getStatusBadge(order.status, t);
                  const p = getPaymentBadge(order.paid, t);

                  return (
                    <tr key={order.orderNo} className="text-sm">
                      <td className="px-4 py-3 font-medium">
                        #{order.orderNo}
                      </td>
                      <td className="px-4 py-3">{order.customerName}</td>
                      <td className="px-4 py-3 text-text-muted">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={s.tone}>{s.label}</Badge>
                      </td>
                      <td className="px-4 py-3 capitalize">{order.type}</td>
                      <td className="px-4 py-3">
                        <Badge tone={p.tone}>{p.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {formatMoney(order.totalPrice)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="h-9 w-9 inline-flex items-center justify-center rounded-xl border"
                          onClick={() => console.log("Actions:", order.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {!isLoading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm">
                    {t("orders.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isError && (
          <div className="border-t px-4 py-3 text-sm text-red-600">
            {error?.message || t("orders.errors.loadFailed")}
          </div>
        )}
      </section>
    </div>
  );
}
