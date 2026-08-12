import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import { useAuth } from "../state/AuthProvider";
import type { Profile } from "../types";

export function useUsers() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
    enabled: isAuthenticated,
    retry: 1,
  });
}
