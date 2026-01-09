import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleMenuAvailability } from "../services/menu";
import { QUERY_KEYS } from "../constants/queryKeys";

export function useToggleMenuAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, next }) => toggleMenuAvailability(id, next),

    // optimistic update
    onMutate: async ({ id, next }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MENU,
      });

      const previous = queryClient.getQueryData(QUERY_KEYS.MENU);

      queryClient.setQueryData(QUERY_KEYS.MENU, (old = []) =>
        old.map((item) =>
          item.id === id ? { ...item, is_available: next } : item
        )
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.MENU, ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MENU,
      });
    },
  });
}
