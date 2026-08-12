export function formatCurrency(value: number | string | null | undefined, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function formatMoney(value: number | string | null | undefined): string {
  return `$${Number(value || 0).toFixed(2)}`;
}

export function formatNumber(value: number | string | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

export function formatDate(date: string | number | Date | null | undefined): string {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function getStartTimestamp(range: string): number | null {
  const now = new Date();

  switch (range) {
    case "today":
      now.setHours(0, 0, 0, 0);
      return now.getTime();

    case "7d":
      return Date.now() - 7 * 24 * 60 * 60 * 1000;

    case "30d":
      return Date.now() - 30 * 24 * 60 * 60 * 1000;

    default:
      return null;
  }
}
