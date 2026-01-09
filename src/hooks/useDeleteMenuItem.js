import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);

      if (error) throw error;
      return id;
    },

    //  optimistic delete
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["menu"] });

      const previousItems = queryClient.getQueryData(["menu"]);

      queryClient.setQueryData(["menu"], (old = []) =>
        old.filter((item) => item.id !== id)
      );

      return { previousItems };
    },

    onError: (_err, _id, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["menu"], context.previousItems);
      }

      toast.error("Failed to delete item");
    },

    onSuccess: () => {
      toast.success("Item deleted successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });
}
