import { supabase } from "./supabase";
import type {
  DbOrderStatus,
  UiOrderStatus,
  NormalizedOrderItem,
  Order,
  OrderRow,
  ReportOrder,
} from "../types";

export function mapStatusToDB(uiStatus: UiOrderStatus): DbOrderStatus {
  switch (uiStatus) {
    case "preparing":
      return "in_progress";
    case "ready":
      return "done";
    case "delivered":
      return "paid";
    default:
      return "in_progress";
  }
}

export function mapStatusToUI(dbStatus: string): UiOrderStatus {
  switch (dbStatus) {
    case "new":
    case "in_progress":
      return "preparing";
    case "done":
      return "ready";
    case "paid":
      return "delivered";
    case "cancelled":
      return "cancelled";
    default:
      return "preparing";
  }
}

function buildSummary(items: NormalizedOrderItem[] = []): string {
  const names = items.map((x) => x?.menu_name).filter(Boolean) as string[];
  if (names.length === 0) return "—";
  if (names.length === 1) return names[0];
  return `${names[0]} +${names.length - 1}`;
}

export async function fetchOrdersBase(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, type, table_id, customer_name, total_price, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as OrderRow[];
}

export async function fetchOrderItemsByOrderIds(orderIds: string[]): Promise<NormalizedOrderItem[]> {
  if (!orderIds?.length) return [];

  const { data, error } = await supabase
    .from("order_items")
    .select("order_id, quantity, item_price, menu_items(name)")
    .in("order_id", orderIds);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    order_id: row.order_id as string,
    quantity: row.quantity as number,
    item_price: row.item_price as number,
    menu_name: (row.menu_items as unknown as { name: string } | null)?.name ?? null,
  }));
}

export function attachItemsToOrders(orders: OrderRow[], items: NormalizedOrderItem[]): Order[] {
  const map = new Map<string, NormalizedOrderItem[]>();
  for (const it of items) {
    const arr = map.get(it.order_id) ?? [];
    arr.push(it);
    map.set(it.order_id, arr);
  }

  return orders.map((o) => {
    const its = map.get(o.id) ?? [];
    const itemTitle = buildSummary(its);

    return {
      id: o.id,
      orderNo: o.order_number,
      status: mapStatusToUI(o.status),
      customerName: o.customer_name ?? "Guest",
      type: o.type,
      table: o.table_id ?? null,
      paid: o.status === "paid",
      createdAt: new Date(o.created_at).getTime(),
      totalPrice: o.total_price,
      orderItems: its,
      itemTitle,
    };
  });
}

export async function fetchOrders(): Promise<Order[]> {
  const orders = await fetchOrdersBase();
  const ids = orders.map((o) => o.id);
  const items = await fetchOrderItemsByOrderIds(ids);
  return attachItemsToOrders(orders, items);
}

export async function updateOrderStatus(orderId: string, uiStatus: UiOrderStatus): Promise<void> {
  const dbStatus = mapStatusToDB(uiStatus);

  const { error } = await supabase
    .from("orders")
    .update({ status: dbStatus })
    .eq("id", orderId);

  if (error) throw error;
}

export async function fetchOrdersByRange(startTimestamp: number | null): Promise<ReportOrder[]> {
  let query = supabase
    .from("orders")
    .select(
      "id, order_number, status, type, table_id, customer_name, total_price, created_at"
    )
    .order("created_at", { ascending: false });

  if (startTimestamp) {
    query = query.gte("created_at", new Date(startTimestamp).toISOString());
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((o) => ({
    ...(o as OrderRow),
    totalPrice: (o as OrderRow).total_price,
    createdAt: new Date((o as OrderRow).created_at).getTime(),
  }));
}
