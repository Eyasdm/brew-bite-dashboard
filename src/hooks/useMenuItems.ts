import { useQuery } from "@tanstack/react-query";
import { fetchMenuItems } from "../services/menu";
import { useAuth } from "../state/AuthProvider";

export function useMenuItems() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenuItems,
    enabled: isAuthenticated,
    retry: 1,
  });
}
