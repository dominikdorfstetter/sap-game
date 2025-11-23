/**
 * Format large numbers with suffixes (K, M, B, T)
 * Examples:
 * - 1,234 => 1.23K
 * - 1,234,567 => 1.23M
 * - 1,234,567,890 => 1.23B
 * - 1,234,567,890,123 => 1.23T
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (num < 1000) {
    return num.toFixed(decimals);
  }

  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q'];
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

  if (tier === 0) return num.toFixed(decimals);

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(decimals) + suffix;
}

/**
 * Format money with $ prefix and K/M/B/T suffixes
 * Examples:
 * - 1,234 => $1.23K
 * - 1,234,567 => $1.23M
 * - 1,234,567,890 => $1.23B
 */
export function formatMoney(amount: number, decimals: number = 2): string {
  return '$' + formatNumber(amount, decimals);
}

/**
 * Format money with full precision for smaller amounts
 * - Under $1000: show cents ($123.45)
 * - Above $1000: use K/M/B suffixes ($1.23K)
 */
export function formatMoneyPrecise(amount: number): string {
  if (Math.abs(amount) < 1000) {
    return '$' + amount.toFixed(2);
  }
  return formatMoney(amount, 2);
}
