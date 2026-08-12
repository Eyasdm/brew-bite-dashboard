import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleMenuAvailability } from "../services/menu";
import { QUERY_KEYS } from "../constants/queryKeys";
import type { MenuItem } from "../types";

interface ToggleVars {
  id: string;
  next: boolean;
}

export function useToggleMenuAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, next }: ToggleVars) => toggleMenuAvailability(id, next),

    onMutate: async ({ id, next }: ToggleVars) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MENU,
      });

      const previous = queryClient.getQueryData<MenuItem[]>(QUERY_KEYS.MENU);

      queryClient.setQueryData<MenuItem[]>(QUERY_KEYS.MENU, (old = []) =>
        old.map((item) =>
          item.id === id ? { ...item, is_available: next } : item
        )
      );

      return { previous };
    },

    onError: (_err: Error, _vars: ToggleVars, ctx?: { previous?: MenuItem[] }) => {
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
