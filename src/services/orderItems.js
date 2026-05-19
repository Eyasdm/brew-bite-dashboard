import { supabase } from "./supabase";

export async function fetchOrderItemsByRange(start) {
  // Supabase PostgREST silently ignores .gte() on embedded/joined table columns.
  // Fix: fetch matching order IDs first, then filter order_items by those IDs.
  let orderIds = null;

  if (start) {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id")
      .gte("created_at", new Date(start).toISOString());

    if (ordersError) throw ordersError;
    orderIds = (orders ?? []).map((o) => o.id);

    // No orders in range — return early, no point querying items
    if (orderIds.length === 0) return [];
  }

  let query = supabase.from("order_items").select(`
      quantity,
      item_price,
      order_id,
      menu_items (
        name,
        category
      ),
      orders (
        created_at
      )
    `);

  if (orderIds) {
    query = query.in("order_id", orderIds);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data ?? [];
}
