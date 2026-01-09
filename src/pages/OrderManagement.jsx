import { useEffect, useMemo, useState } from "react";
import { Calendar, MoreHorizontal, Search as SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import SelectMenu from "../components/SelectMenu";
import {
  getOrderDateOptions,
  getOrderStatusOptions,
  getOrderTypeOptions,
} from "../constants/filters.constants";
import { fetchOrders } from "../services/orders";
import { getStartTimestamp } from "../utils/formaters";

/* -----------------------------------------------------
 * Utility helpers
 * --------------------------------------------------- */
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

/* -----------------------------------------------------
 * Badge component
 * --------------------------------------------------- */
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
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

/* -----------------------------------------------------
 * Status / Payment badge mappers
 * --------------------------------------------------- */
function statusBadge(status, t) {
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

function paymentBadge(isPaid, t) {
  return isPaid
    ? { tone: "green", label: t("orders.payment.paid") }
    : { tone: "red", label: t("orders.payment.unpaid") };
}

/* =====================================================
 * Order Management Page
 * =================================================== */
export default function OrderManagement() {
  const { t } = useTranslation();

  /* -------------------------------
   * Filters state
   * ----------------------------- */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [dateRange, setDateRange] = useState("7d");

  /* -------------------------------
   * Data state
   * ----------------------------- */
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* -------------------------------
   * Load orders from Supabase
   * ----------------------------- */
  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        setError(err?.message || t("orders.errors.loadFailed"));
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [t]);

  /* -------------------------------
   * Filtered orders (search + filters)
   * ----------------------------- */
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const startTime = getStartTimestamp(dateRange);

    return orders.filter((o) => {
      // 1. Search filter
      const matchesSearch =
        !q ||
        o.orderNo?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.itemTitle?.toLowerCase().includes(q);

      // 2. Status filter
      const matchesStatus = status === "all" ? true : o.status === status;

      // 3. Type filter
      const matchesType = type === "all" ? true : o.type === type;

      // 4. Date range filter
      const matchesDate = !startTime || o.createdAt >= startTime;

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [orders, search, status, type, dateRange]);

  /* =====================================================
   * Render
   * =================================================== */
  return (
    <div className="space-y-6 max-w-full">
      {/* ================= Header ================= */}
      <div>
        <h1 className="text-xl font-semibold text-text-strong">
          {t("orders.title")}
        </h1>
        <p className="mt-1 text-sm text-text-muted">{t("orders.subtitle")}</p>
      </div>

      {/* ================= Filters ================= */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="text-sm font-medium text-text-strong">
          {t("orders.filters")}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px_220px]">
          {/* Search */}
          <div>
            <div className="flex h-11 items-center gap-2 rounded-xl border border-border bg-bg px-3">
              <SearchIcon className="h-4 w-4 text-text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("orders.search")}
                className="h-full w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Status */}
          <SelectMenu
            value={status}
            onChange={setStatus}
            options={getOrderStatusOptions(t)}
            className="w-full"
          />

          {/* Type */}
          <SelectMenu
            value={type}
            onChange={setType}
            options={getOrderTypeOptions(t)}
            className="w-full"
          />

          {/* Date range */}
          <div className="flex items-center gap-2">
            <SelectMenu
              value={dateRange}
              onChange={setDateRange}
              options={getOrderDateOptions(t)}
              className="flex-1"
            />

            <button
              type="button"
              className="h-11 w-11 inline-flex items-center justify-center rounded-xl border border-border bg-bg hover:bg-muted transition"
              title={t("orders.dateRange")}
            >
              <Calendar className="h-4 w-4 text-text-muted" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= Table ================= */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="text-sm font-medium">
            {t("orders.recent")} ({filteredOrders.length})
          </div>
          <div className="text-xs text-text-muted">{t("orders.showing")}</div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px]">
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

            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm">
                    {t("orders.loading")}
                  </td>
                </tr>
              )}

              {!loading &&
                filteredOrders.map((o) => {
                  const s = statusBadge(o.status, t);
                  const p = paymentBadge(o.paid, t);

                  return (
                    <tr key={o.orderNo} className="text-sm">
                      <td className="px-4 py-3 font-medium">#{o.orderNo}</td>
                      <td className="px-4 py-3">{o.customerName}</td>
                      <td className="px-4 py-3 text-text-muted">
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={s.tone}>{s.label}</Badge>
                      </td>
                      <td className="px-4 py-3 capitalize">{o.type}</td>
                      <td className="px-4 py-3">
                        <Badge tone={p.tone}>{p.label}</Badge>
                      </td>
                      <td className="px-4 py-3">{formatMoney(o.totalPrice)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="h-9 w-9 inline-flex items-center justify-center rounded-xl border"
                          onClick={() => console.log("Actions:", o.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm">
                    {t("orders.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {error && (
          <div className="px-4 py-3 text-sm text-red-600 border-t">{error}</div>
        )}
      </section>
    </div>
  );
}
