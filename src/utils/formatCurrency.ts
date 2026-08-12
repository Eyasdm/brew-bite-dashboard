const USD_TO_IDR_RATE = 16200;

export function formatCurrency(value: number | string | null | undefined, currency: string): string {
  const amount = Number(value || 0);

  if (currency === "idr") {
    const converted = amount * USD_TO_IDR_RATE;

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(converted);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}
