import type { TFunction } from "i18next";
import type { SelectOption } from "../types";

export const getOrderStatusOptions = (t: TFunction): SelectOption[] => [
  { value: "all", label: t("filters.status.all") },
  { value: "preparing", label: t("orders.status.preparing") },
  { value: "ready", label: t("orders.status.ready") },
  { value: "delivered", label: t("orders.status.delivered") },
];

export const getOrderSortOptions = (t: TFunction): SelectOption[] => [
  { value: "newest", label: t("filters.sort.newest") },
  { value: "oldest", label: t("filters.sort.oldest") },
];

export const getOrderTypeOptions = (t: TFunction): SelectOption[] => [
  { value: "all", label: t("filters.type.all") },
  { value: "in-store", label: t("filters.type.inStore") },
  { value: "delivery", label: t("filters.type.delivery") },
  { value: "pickup", label: t("filters.type.pickup") },
];

export const getOrderDateOptions = (t: TFunction): SelectOption[] => [
  { value: "today", label: t("filters.date.today") },
  { value: "7d", label: t("filters.date.last7") },
  { value: "30d", label: t("filters.date.last30") },
  { value: "custom", label: t("filters.date.custom") },
];
