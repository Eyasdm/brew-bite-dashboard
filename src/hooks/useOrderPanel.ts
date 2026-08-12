import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrders, updateOrderStatus } from "../services/orders";
import { QUERY_KEYS } from "../constants/queryKeys";
import { useAuth } from "../state/AuthProvider";
import type { Order, UiOrderStatus } from "../types";

interface UpdateStatusVars {
  id: string;
  status: UiOrderStatus;
}

export function useOrderPanel() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const ordersQuery = useQuery({
    queryKey: QUERY_KEYS.ORDERS,
    queryFn: fetchOrders,
    staleTime: 1000 * 30,
    enabled: isAuthenticated,
    retry: 1,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: UpdateStatusVars) => updateOrderStatus(id, status),
    onMutate: async ({ id, status }: UpdateStatusVars) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.ORDERS });

      const previousOrders = queryClient.getQueryData<Order[]>(QUERY_KEYS.ORDERS);

      queryClient.setQueryData<Order[]>(QUERY_KEYS.ORDERS, (old = []) =>
        old.map((o) => (o.id === id ? { ...o, status } : o)),
      );

      return { previousOrders };
    },
    onError: (_err: Error, _vars: UpdateStatusVars, context?: { previousOrders?: Order[] }) => {
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
