export function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value || 0);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}
export function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function getStartTimestamp(range) {
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
      return null; // all time
  }
}
