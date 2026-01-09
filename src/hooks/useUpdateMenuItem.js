import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";

async function updateMenuItem({ id, payload }) {
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

  return useMutation({
    mutationFn: updateMenuItem,

    // optimistic update
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MENU,
      });

      const previous = queryClient.getQueryData(QUERY_KEYS.MENU);

      queryClient.setQueryData(QUERY_KEYS.MENU, (old = []) =>
        old.map((item) =>
          item.id === id
            ? {
                ...item,
                name: payload.name,
                price: payload.price,
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

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.MENU, ctx.previous);
      }

      toast.error("Failed to update item");
    },

    onSuccess: () => {
      toast.success("Item updated successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MENU,
      });
    },
  });
}
