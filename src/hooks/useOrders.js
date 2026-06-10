import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../services/orders";
import { QUERY_KEYS } from "../constants/queryKeys";
import { useAuth } from "../state/AuthProvider";

export function useOrders() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.ORDERS,
    queryFn: fetchOrders,
    staleTime: 1000 * 60, // 1 minute
    enabled: isAuthenticated,
    retry: 1,
  });
}
