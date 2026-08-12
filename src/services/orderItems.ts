import { supabase } from "./supabase";
import type { OrderItemWithJoins } from "../types";

export async function fetchOrderItemsByRange(start: number | null): Promise<OrderItemWithJoins[]> {
  let orderIds: string[] | null = null;

  if (start) {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id")
      .gte("created_at", new Date(start).toISOString());

    if (ordersError) throw ordersError;
    orderIds = (orders ?? []).map((o) => o.id as string);

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

  return (data ?? []) as unknown as OrderItemWithJoins[];
}
