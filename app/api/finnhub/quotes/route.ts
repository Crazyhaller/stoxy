import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 60 // Cache results for 60 seconds

/**
 * Batch quotes endpoint
 * Accepts POST { symbols: ['AAPL', 'MSFT', ...] }
 * Returns { quotes: [{ symbol, quote: { c, dp, ... } }, ...] }
 * Results are cached for 60 seconds to reduce API calls to Finnhub.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const symbols = (body.symbols || []) as string[]

    if (!Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json({ quotes: [] }, { status: 200 })
    }

    const apiKey = process.env.FINNHUB_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'FINNHUB_API_KEY not configured' },
        { status: 500 }
      )
    }

    // Fetch quotes in parallel
    const quotes = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          const cleanSymbol = String(symbol).trim().toUpperCase()
          if (!cleanSymbol) return null

          const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
            cleanSymbol
          )}&token=${apiKey}`

          const res = await fetch(url)
          if (!res.ok) {
            console.error(
              `Finnhub quote fetch failed for ${cleanSymbol}:`,
              res.status
            )
            return null
          }

          const quote = await res.json()
          return {
            symbol: cleanSymbol,
            quote, // { c, dp, h, l, o, pc, ... }
          }
        } catch (error) {
          console.error(`Error fetching quote for ${symbol}:`, error)
          return null
        }
      })
    )

    // Filter out failed requests
    const validQuotes = quotes.filter(
      (q): q is { symbol: string; quote: unknown } => q !== null
    )

    return NextResponse.json(
      { quotes: validQuotes },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Batch quotes endpoint error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes', quotes: [] },
      { status: 500 }
    )
  }
}
