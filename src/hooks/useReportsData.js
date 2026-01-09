import { useEffect, useState } from "react";
import { fetchOrdersByRange } from "../services/orders";
import { getRangeStart } from "../utils/reports.utils";

export function useReportsData(range) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const start = getRangeStart(range);
        const data = await fetchOrdersByRange(start);
        setOrders(data);
      } catch (e) {
        console.error("Failed to load reports", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [range]);

  return { orders, loading };
}
