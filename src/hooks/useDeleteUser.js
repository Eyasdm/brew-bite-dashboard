import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: { userId: id },
      });

      if (error) throw error;
      return id;
    },

    // optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previous = queryClient.getQueryData(["users"]);

      queryClient.setQueryData(["users"], (old = []) =>
        old.filter((u) => u.id !== id)
      );

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["users"], ctx.previous);
      }
      toast.error("Failed to delete user");
    },

    onSuccess: () => {
      toast.success("User deleted successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
