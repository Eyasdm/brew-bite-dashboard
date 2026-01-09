import { useEffect, useState } from "react";
import { fetchOrderItemsByRange } from "../services/orderItems";
import { getRangeStart } from "../utils/reports.utils";

export function useProductsData(range) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const start = getRangeStart(range);
        const data = await fetchOrderItemsByRange(start);
        setItems(data);
      } catch (e) {
        console.error("Failed to load product reports", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [range]);

  return { items, loading };
}
