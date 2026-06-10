import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import { useAuth } from "../state/AuthProvider";

export function useUsers() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
    retry: 1,
  });
}
