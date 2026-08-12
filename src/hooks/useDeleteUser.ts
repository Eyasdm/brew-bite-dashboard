import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import type { Profile } from "../types";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: { userId: id },
      });

      if (error) throw error;
      return id;
    },

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previous = queryClient.getQueryData<Profile[]>(["users"]);

      queryClient.setQueryData<Profile[]>(["users"], (old = []) =>
        old.filter((u) => u.id !== id)
      );

      return { previous };
    },

    onError: (_err: Error, _id: string, ctx?: { previous?: Profile[] }) => {
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
