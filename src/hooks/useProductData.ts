import { useQuery } from "@tanstack/react-query";
import { fetchOrderItemsByRange } from "../services/orderItems";
import { getRangeStart } from "../utils/reports.utils";
import { useAuth } from "../state/AuthProvider";
import type { OrderItemWithJoins } from "../types";

export function useProductsData(range: string) {
  const { isAuthenticated } = useAuth();

  const { data: items = [], isLoading: loading } = useQuery<OrderItemWithJoins[]>({
    queryKey: ["reports-products", range],
    queryFn: () => fetchOrderItemsByRange(getRangeStart(range)),
    staleTime: 60_000,
    enabled: isAuthenticated,
    retry: 1,
  });

  return { items, loading };
}
