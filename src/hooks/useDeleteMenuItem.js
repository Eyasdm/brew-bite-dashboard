import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import { QUERY_KEYS } from "../constants/queryKeys";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);

      if (error) throw error;
      return id;
    },

    //  optimistic delete
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.MENU });

      const previousItems = queryClient.getQueryData(QUERY_KEYS.MENU);

      queryClient.setQueryData(QUERY_KEYS.MENU, (old = []) =>
        old.filter((item) => item.id !== id)
      );

      return { previousItems };
    },

    onError: (_err, _id, context) => {
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
