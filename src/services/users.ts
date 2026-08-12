import { supabase } from "./supabase";

export async function fetchActiveStaffCount(): Promise<number> {
  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true)
    .in("role", ["admin", "staff", "cashier"]);

  if (error) throw error;

  return count ?? 0;
}
