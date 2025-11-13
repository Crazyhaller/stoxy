/**
 * Generates mock historical price data for sparkline visualization.
 * In production, you'd fetch this from a real historical API (e.g., Finnhub historical data endpoint).
 *
 * For now, we generate a realistic-looking trend based on current price and change.
 */
export function generateSparklineData(
  currentPrice: number | undefined,
  changePercent: number | undefined,
  points: number = 20
): number[] {
  if (!currentPrice || currentPrice <= 0) {
    return []
  }

  // Generate a realistic price history trend
  // If change is positive, trend upward; if negative, trend downward
  const changeAmount = currentPrice * ((changePercent || 0) / 100)
  const startPrice = currentPrice - changeAmount

  const data: number[] = []
  for (let i = 0; i < points; i++) {
    // Create a smooth curve from start to current price with some noise
    const progress = i / (points - 1)
    const trendedPrice = startPrice + (currentPrice - startPrice) * progress

    // Add small random noise to make it look more realistic
    const noise = (Math.random() - 0.5) * (currentPrice * 0.02)
    const price = Math.max(0, trendedPrice + noise)

    data.push(parseFloat(price.toFixed(2)))
  }

  return data
}
