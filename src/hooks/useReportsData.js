import { useQuery } from "@tanstack/react-query";
import { fetchOrdersByRange } from "../services/orders";
import { getRangeStart } from "../utils/reports.utils";

export function useReportsData(range) {
  const { data: orders = [], isLoading: loading } = useQuery({
    queryKey: ["reports-orders", range],
    queryFn: () => fetchOrdersByRange(getRangeStart(range)),
    staleTime: 60_000,
  });

  return { orders, loading };
}
