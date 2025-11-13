import { NextResponse } from 'next/server'

const FINNHUB_BASE = 'https://finnhub.io/api/v1'

export const revalidate = 60 // Cache results for 60 seconds

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const symbol = (url.searchParams.get('symbol') || '').trim().toUpperCase()
    if (!symbol)
      return NextResponse.json({ error: 'Missing symbol' }, { status: 400 })

    const token = process.env.FINNHUB_API_KEY
    if (!token)
      return NextResponse.json(
        { error: 'No API key configured' },
        { status: 500 }
      )

    const res = await fetch(
      `${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(
        symbol
      )}&token=${token}`
    )
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return NextResponse.json(
        { error: `Upstream error ${res.status}: ${text}` },
        { status: 502 }
      )
    }

    const json = await res.json()
    return NextResponse.json({ symbol, quote: json })
  } catch (error) {
    console.error('GET /api/finnhub/quote error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
