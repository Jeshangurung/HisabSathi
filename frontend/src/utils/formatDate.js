export function formatDate(value) {
  if (!value) {
    return "Not set";
  }
  return new Intl.DateTimeFormat("en-NP", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
