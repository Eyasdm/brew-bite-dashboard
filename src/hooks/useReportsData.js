import { useQuery } from "@tanstack/react-query";
import { fetchOrdersByRange } from "../services/orders";
import { getRangeStart } from "../utils/reports.utils";
import { useAuth } from "../state/AuthProvider";

export function useReportsData(range) {
  const { isAuthenticated } = useAuth();

  const { data: orders = [], isLoading: loading } = useQuery({
    queryKey: ["reports-orders", range],
    queryFn: () => fetchOrdersByRange(getRangeStart(range)),
    staleTime: 60_000,
    enabled: isAuthenticated,
    retry: 1,
  });

  return { orders, loading };
}
