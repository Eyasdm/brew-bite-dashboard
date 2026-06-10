import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, updateOrderStatus } from "../services/orders";
import { QUERY_KEYS } from "../constants/queryKeys";
import { useAuth } from "../state/AuthProvider";

export function useOrderPanel() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const ordersQuery = useQuery({
    queryKey: QUERY_KEYS.ORDERS,
    queryFn: fetchOrders,
    staleTime: 1000 * 30, // 30s (near real-time)
    // Don't fetch when there is no valid session — avoids 500 errors from
    // Supabase when the access token is expired or the refresh failed.
    enabled: isAuthenticated,
    retry: 1,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.ORDERS });

      const previousOrders = queryClient.getQueryData(QUERY_KEYS.ORDERS);

      queryClient.setQueryData(QUERY_KEYS.ORDERS, (old = []) =>
        old.map((o) => (o.id === id ? { ...o, status } : o)),
      );

      return { previousOrders };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(QUERY_KEYS.ORDERS, context.previousOrders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    refetch: ordersQuery.refetch,
    updateStatus: updateStatusMutation.mutateAsync,
    updating: updateStatusMutation.isPending,
  };
}
