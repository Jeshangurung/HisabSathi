export function isPositiveMoney(value) {
  return Number(value) > 0;
}

export function required(value) {
  return String(value ?? "").trim().length > 0;
}

export function parseIdList(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number)
    .filter((item) => Number.isInteger(item) && item > 0);
}

export function sumMoney(values) {
  return values.reduce((total, item) => total + Number(item || 0), 0);
}
