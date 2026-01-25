const USD_TO_IDR_RATE = 15500;

export function formatCurrency(value, currency) {
  const amount = Number(value || 0);

  if (currency === "idr") {
    const converted = amount * USD_TO_IDR_RATE;

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(converted);
  }

  // default USD
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}
