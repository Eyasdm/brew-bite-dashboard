import { useQuery } from "@tanstack/react-query";
import { fetchMenuItems } from "../services/menu";

export function useMenuItems() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenuItems,
  });
}
