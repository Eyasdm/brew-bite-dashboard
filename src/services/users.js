import { supabase } from "./supabase";

/**
 * Fetch count of active staff/admin users
 */
export async function fetchActiveStaffCount() {
  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .in("role", ["admin", "staff", "cashier"]);

  if (error) throw error;

  return count ?? 0;
}
