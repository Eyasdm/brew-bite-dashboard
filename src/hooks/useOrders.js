import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../services/orders";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}
