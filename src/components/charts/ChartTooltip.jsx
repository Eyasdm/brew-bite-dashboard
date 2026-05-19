import { formatNumber } from "../../utils/formaters";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCurrency } from "../../context/CurrencyContext";

export default function ChartTooltip({
  active,
  payload,
  label,
  type = "currency", // "currency" | "number"
}) {
  const { currency } = useCurrency();

  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
      <p className="mb-1 text-xs text-text-muted">{label}</p>

      {payload.map((item) => (
        <div key={item.dataKey} className="flex justify-between gap-4 text-sm">
          <span>{item.name}</span>
          <span className="font-medium">
            {type === "currency"
              ? formatCurrency(item.value, currency)
              : formatNumber(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
