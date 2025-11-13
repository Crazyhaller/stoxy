'use client'

import React, { useEffect, useState } from 'react'
import WatchlistButton from './WatchlistButton'

type Props = {
  symbol: string
  company?: string
}

export default function StockWatchlistButton({ symbol, company }: Props) {
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/watchlist')
        if (!mounted) return
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        const set = new Set<string>(
          (data.items || []).map((i: unknown) =>
            String((i as { symbol?: string }).symbol ?? '').toUpperCase()
          )
        )
        setIsInWatchlist(set.has(String(symbol).toUpperCase()))
      } catch (e) {
        // leave false if not available / not logged in
        console.error('Failed to fetch watchlist for stock page', e)
      }
    })()
    return () => {
      mounted = false
    }
  }, [symbol])

  return (
    <WatchlistButton
      symbol={symbol}
      company={company ?? symbol}
      isInWatchlist={isInWatchlist}
      onWatchlistChange={(sym, added) => setIsInWatchlist(added)}
    />
  )
}
