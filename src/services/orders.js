import { supabase } from "./supabase";

export function mapStatusToDB(uiStatus) {
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

export function mapStatusToUI(dbStatus) {
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

// UI summary: "Item" OR "Item +N"
function buildSummary(items = []) {
  const names = items.map((x) => x?.menu_name).filter(Boolean);
  if (names.length === 0) return "—";
  if (names.length === 1) return names[0];
  return `${names[0]} +${names.length - 1}`;
}

/**
 * ✅ 1) Fetch orders only
 */
export async function fetchOrdersBase() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, type, table_id, customer_name, total_price, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * ✅ 2) Fetch items for many orders in ONE call
 * returns rows shaped like:
 * { order_id, quantity, item_price, menu_name }
 */
export async function fetchOrderItemsByOrderIds(orderIds) {
  if (!orderIds?.length) return [];

  const { data, error } = await supabase
    .from("order_items")
    .select("order_id, quantity, item_price, menu_items(name)")
    .in("order_id", orderIds);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    order_id: row.order_id,
    quantity: row.quantity,
    item_price: row.item_price,
    menu_name: row.menu_items?.name ?? null,
  }));
}

/**
 * ✅ 3) Merge
 */
export function attachItemsToOrders(orders, items) {
  const map = new Map();
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

      // ✅ هنا المحتوى الفعلي
      orderItems: its, // لو احتجته في صفحة التفاصيل
      itemTitle, // ده الملخص اللي هتستخدمه في OrderCard
    };
  });
}

/**
 * ✅ final function you call from OrderPanel
 */
export async function fetchOrders() {
  const orders = await fetchOrdersBase();
  const ids = orders.map((o) => o.id);
  const items = await fetchOrderItemsByOrderIds(ids);
  return attachItemsToOrders(orders, items);
}

export async function updateOrderStatus(orderId, uiStatus) {
  const dbStatus = mapStatusToDB(uiStatus);

  const { error } = await supabase
    .from("orders")
    .update({ status: dbStatus })
    .eq("id", orderId);

  if (error) throw error;
}

export async function fetchOrdersByRange(startTimestamp) {
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

  // 🔽 IMPORTANT: normalize fields here
  return (data ?? []).map((o) => ({
    ...o,
    totalPrice: o.total_price, // ✅ FIX
    createdAt: new Date(o.created_at).getTime(), // ✅ FIX
  }));
}
