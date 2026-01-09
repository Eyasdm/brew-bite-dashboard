import { supabase } from "./supabase";

export async function fetchOrderItemsByRange(start) {
  let query = supabase.from("order_items").select(`
      quantity,
      item_price,
      menu_items (
        name,
        category
      ),
      orders (
        created_at
      )
    `);

  if (start) {
    query = query.gte("orders.created_at", new Date(start).toISOString());
  }

  const { data, error } = await query;
  if (error) throw error;

  return data ?? [];
}
