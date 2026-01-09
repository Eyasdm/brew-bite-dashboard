import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDrink } from "../services/menu";
import { QUERY_KEYS } from "../constants/queryKeys";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useAddDrink() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: addDrink,

    // ✅ Optimistic insert
    onMutate: async (newDrink) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MENU,
      });

      const previous = queryClient.getQueryData(QUERY_KEYS.MENU);

      const optimisticItem = {
        id: `temp-${Date.now()}`,
        name: newDrink.name,
        price: newDrink.price,
        category: newDrink.category,
        description: newDrink.description,
        image_url: newDrink.image,
        is_available: newDrink.available,
        created_at: new Date().toISOString(),
        __optimistic: true,
      };

      queryClient.setQueryData(QUERY_KEYS.MENU, (old = []) => [
        optimisticItem,
        ...old,
      ]);

      return { previous };
    },

    // ❌ Error → rollback + toast
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.MENU, ctx.previous);
      }

      toast.error(t("menu.toast.addError"));
    },

    // ✅ Success toast
    onSuccess: () => {
      toast.success(t("menu.toast.addSuccess"));
    },

    // 🔄 Refetch real data
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MENU,
      });
    },
  });
}
