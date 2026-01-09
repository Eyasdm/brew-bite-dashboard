import { supabase } from "./supabase";

export async function fetchMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select(
      `
      id,
      name,
      description,
      category,
      sub_category,
      price,
      image_url,
      is_available,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function toggleMenuAvailability(id, nextValue) {
  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: nextValue })
    .eq("id", id);

  if (error) throw error;
}

/* ----------------------------- */
/* ✅ ADD DRINK                  */
/* ----------------------------- */
export async function addDrink(payload) {
  const { name, price, category, image, description, available } = payload;

  const { error } = await supabase.from("menu_items").insert({
    name,
    price,
    category,
    description,
    image_url: image || null,
    is_available: available,
  });

  if (error) throw error;
}

export async function deleteMenuItem(id) {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) throw error;
}
