import { useQuery } from "@tanstack/react-query";
import { fetchOrderItemsByRange } from "../services/orderItems";
import { getRangeStart } from "../utils/reports.utils";

export function useProductsData(range) {
  const { data: items = [], isLoading: loading } = useQuery({
    queryKey: ["reports-products", range],
    queryFn: () => fetchOrderItemsByRange(getRangeStart(range)),
    staleTime: 60_000,
  });

  return { items, loading };
}
