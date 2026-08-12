import { supabase } from "./supabase";
import type { AddDrinkPayload, MenuItem } from "../types";

export async function fetchMenuItems(): Promise<MenuItem[]> {
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
  return (data ?? []) as MenuItem[];
}

export async function toggleMenuAvailability(id: string, nextValue: boolean): Promise<void> {
  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: nextValue })
    .eq("id", id);

  if (error) throw error;
}

export async function addDrink(payload: AddDrinkPayload): Promise<void> {
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

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) throw error;
}
