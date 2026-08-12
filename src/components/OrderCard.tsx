import {
  CheckCircle2,
  Clock3,
  Coffee,
  MoreVertical,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Order, UiOrderStatus } from "../types";

interface OrderCardProps {
  order: Order & { itemMeta?: string; estMins?: number };
  onChangeStatus: (id: string, status: UiOrderStatus) => void;
  loading?: boolean;
}

function OrderCard({ order, onChangeStatus }: OrderCardProps) {
  const { t } = useTranslation();

  const isPreparing = order.status === "preparing";
  const isReady = order.status === "ready";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-text">#{order.orderNo}</p>
          <StatusPill status={order.status} />
        </div>

        <button
          type="button"
          className="h-9 w-9 grid place-items-center rounded-xl border border-border bg-card text-text-muted hover:bg-muted hover:text-text transition"
          aria-label={t("orders.actions")}
          title={t("orders.actions")}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* main */}
      <div className="mt-4">
        <p className="text-base font-semibold text-text">
          {order.customerName || t("orders.guest")}
        </p>

        {order.itemMeta ? (
          <p className="mt-1 text-sm text-text-muted">{order.itemMeta}</p>
        ) : null}
      </div>

      {/* details */}
      <div className="mt-4 space-y-2">
        <div className="mt-1 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-text-muted">
            <Coffee className="h-4 w-4" />
          </span>

          <span className="truncate text-sm font-medium text-text-muted">
            {order.itemTitle || t("common.notAvailable")}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-text min-w-0">
            <span className="h-7 w-7 rounded-lg bg-muted grid place-items-center shrink-0">
              {order.type === "dine-in" ? (
                <UtensilsCrossed className="h-4 w-4 text-text-muted" />
              ) : (
                <ShoppingBag className="h-4 w-4 text-text-muted" />
              )}
            </span>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-text-muted">
                {t(`orders.type.${order.type || "unknown"}`)}
              </span>

              {order.type === "dine-in" && order.table ? (
                <span className="ml-1 shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-text-muted">
                  {t("orders.table")} {order.table}
                </span>
              ) : null}
            </div>
          </div>

          {/* Paid / Unpaid badge — theme-aware */}
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
              order.paid ? "badge-green" : "badge-gray"
            }`}
          >
            {order.paid ? t("orders.payment.paid") : t("orders.payment.unpaid")}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-text-muted flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-muted grid place-items-center">
              <Clock3 className="h-4 w-4 text-text-muted" />
            </span>

            <span>{formatTime(order.createdAt)}</span>

            {isPreparing && typeof order.estMins === "number" ? (
              <>
                <span className="text-text-muted">•</span>
                <span className="text-primary">
                  {t("orders.estimate", { mins: order.estMins })}
                </span>
              </>
            ) : null}
          </div>

          {/* actions */}
          <div className="flex items-center gap-2">
            {isPreparing ? (
              <button
                type="button"
                onClick={() => onChangeStatus(order.id, "ready")}
                className="h-10 px-4 rounded-xl bg-success text-success-fg hover:opacity-90 transition inline-flex items-center gap-2 text-sm font-medium"
              >
                <CheckCircle2 className="h-4 w-4" />
                {t("orders.markReady")}
              </button>
            ) : null}

            {isReady ? (
              <button
                type="button"
                onClick={() => onChangeStatus(order.id, "delivered")}
                className="h-10 px-4 rounded-xl bg-info text-info-fg hover:opacity-90 transition inline-flex items-center gap-2 text-sm font-medium"
              >
                <Truck className="h-4 w-4" />
                {t("orders.markDelivered")}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(ts: number): string {
  try {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

interface StatusPillProps {
  status: UiOrderStatus;
}

function StatusPill({ status }: StatusPillProps) {
  const { t } = useTranslation();

  const cfg = {
    preparing: {
      label: t("orders.status.preparing"),
      icon: Clock3,
      className: "bg-warning-soft text-warning",
    },
    ready: {
      label: t("orders.status.ready"),
      icon: CheckCircle2,
      className: "bg-success-soft text-success",
    },
    delivered: {
      label: t("orders.status.delivered"),
      icon: Truck,
      className: "bg-info-soft text-info",
    },
    cancelled: {
      label: t("orders.status.cancelled"),
      icon: Clock3,
      className: "bg-muted text-text-muted",
    },
  }[status];

  const Icon: LucideIcon = cfg?.icon ?? Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        cfg?.className || "bg-muted text-text-muted"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {cfg?.label || status}
    </span>
  );
}

export default OrderCard;
