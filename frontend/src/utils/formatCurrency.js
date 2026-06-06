export function formatCurrency(value) {
  const number = Number(value ?? 0);
  return new Intl.NumberFormat("en-NP", {
    currency: "NPR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(Number.isNaN(number) ? 0 : number);
}
