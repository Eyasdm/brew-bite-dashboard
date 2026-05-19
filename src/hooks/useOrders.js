import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../services/orders";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS,
    queryFn: fetchOrders,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}
