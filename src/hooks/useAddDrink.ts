import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDrink } from "../services/menu";
import { QUERY_KEYS } from "../constants/queryKeys";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { AddDrinkPayload, MenuItem } from "../types";

export function useAddDrink() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: addDrink,

    onMutate: async (newDrink: AddDrinkPayload) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MENU,
      });

      const previous = queryClient.getQueryData<MenuItem[]>(QUERY_KEYS.MENU);

      const optimisticItem: MenuItem & { __optimistic: boolean } = {
        id: `temp-${Date.now()}`,
        name: newDrink.name,
        price: newDrink.price,
        category: newDrink.category,
        description: newDrink.description,
        image_url: newDrink.image,
        is_available: newDrink.available,
        created_at: new Date().toISOString(),
        sub_category: null,
        __optimistic: true,
      };

      queryClient.setQueryData<MenuItem[]>(QUERY_KEYS.MENU, (old = []) => [
        optimisticItem,
        ...old,
      ]);

      return { previous };
    },

    onError: (_err: Error, _vars: AddDrinkPayload, ctx?: { previous?: MenuItem[] }) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.MENU, ctx.previous);
      }

      toast.error(t("menu.toast.addError"));
    },

    onSuccess: () => {
      toast.success(t("menu.toast.addSuccess"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MENU,
      });
    },
  });
}
