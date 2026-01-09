import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: {
          email: payload.email,
          password: payload.password,
          full_name: payload.full_name,
          role: payload.role,
          is_active: payload.is_active,
        },
      });

      if (error) throw error;
      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
        refetchType: "active",
      });

      await queryClient.refetchQueries({
        queryKey: ["users"],
      });
      toast.success("User created successfully");
    },

    onError: (err) => {
      console.error(err);
      toast.error("User not created");
    },
  });
}
