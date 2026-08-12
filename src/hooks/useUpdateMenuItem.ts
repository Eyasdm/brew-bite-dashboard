import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { MenuItemFormData, MenuItem } from "../types";

interface UpdateMenuItemVars {
  id: string;
  payload: MenuItemFormData;
}

async function updateMenuItem({ id, payload }: UpdateMenuItemVars): Promise<void> {
  const { error } = await supabase
    .from("menu_items")
    .update({
      name: payload.name,
      price: payload.price,
      category: payload.category,
      description: payload.description,
      image_url: payload.image,
      is_available: payload.available,
    })
    .eq("id", id);

  if (error) throw error;
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: updateMenuItem,

    onMutate: async ({ id, payload }: UpdateMenuItemVars) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MENU,
      });

      const previous = queryClient.getQueryData<MenuItem[]>(QUERY_KEYS.MENU);

      queryClient.setQueryData<MenuItem[]>(QUERY_KEYS.MENU, (old = []) =>
        old.map((item) =>
          item.id === id
            ? {
                ...item,
                name: payload.name,
                price: Number(payload.price),
                category: payload.category,
                description: payload.description,
                image_url: payload.image,
                is_available: payload.available,
              }
            : item
        )
      );

      return { previous };
    },

    onError: (_err: Error, _vars: UpdateMenuItemVars, ctx?: { previous?: MenuItem[] }) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.MENU, ctx.previous);
      }

      toast.error(t("menu.toast.updateError"));
    },

    onSuccess: () => {
      toast.success(t("menu.toast.updateSuccess"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MENU,
      });
    },
  });
}
