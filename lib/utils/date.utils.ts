/**
 * Format date to YY.MM.DD format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "25.12.31")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear().toString().slice(2)}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Format date to localized date string
 * @param dateString - ISO date string
 * @returns Localized date string
 */
export function formatLocalDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}
