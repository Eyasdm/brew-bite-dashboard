import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import type { UpdateUserPayload } from "../types";

interface UpdateUserVars {
  id: string;
  payload: UpdateUserPayload;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateUserVars) => {
      const { error } = await supabase
        .from("users")
        .update(payload)
        .eq("id", id);

      if (error) throw error;
    },

    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: () => {
      toast.error("Failed to update user");
    },
  });
}
