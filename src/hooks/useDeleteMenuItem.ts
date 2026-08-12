import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import { QUERY_KEYS } from "../constants/queryKeys";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "../types";

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);

      if (error) throw error;
      return id;
    },

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.MENU });

      const previousItems = queryClient.getQueryData<MenuItem[]>(QUERY_KEYS.MENU);

      queryClient.setQueryData<MenuItem[]>(QUERY_KEYS.MENU, (old = []) =>
        old.filter((item) => item.id !== id)
      );

      return { previousItems };
    },

    onError: (_err: Error, _id: string, context?: { previousItems?: MenuItem[] }) => {
      if (context?.previousItems) {
        queryClient.setQueryData(QUERY_KEYS.MENU, context.previousItems);
      }

      toast.error(t("menu.toast.deleteError"));
    },

    onSuccess: () => {
      toast.success(t("menu.toast.deleteSuccess"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MENU });
    },
  });
}
