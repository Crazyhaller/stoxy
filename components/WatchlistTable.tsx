'use client'

import React, { useEffect, useState } from 'react'
import TradingViewWidget from './TradingViewWidget'
import { BASELINE_WIDGET_CONFIG } from '@/lib/constants'
import Link from 'next/link'

const WatchlistTable = () => {
  const [items, setItems] = useState<
    {
      symbol: string
      company: string
      addedAt?: string
      price?: number
      change?: number
    }[]
  >([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/watchlist')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      const mapped = (data.items || []).map((i: unknown) => {
        const it = i as { symbol: string; company: string; addedAt?: string }
        return { symbol: it.symbol, company: it.company, addedAt: it.addedAt }
      })
      setItems(mapped)

      // fetch quotes for each symbol (small parallel requests)
      await Promise.all(
        mapped.map(
          async (it: { symbol: string; company: string; addedAt?: string }) => {
            try {
              const q = await fetch(
                `/api/finnhub/quote?symbol=${encodeURIComponent(it.symbol)}`
              )
              if (!q.ok) return
              const dq = await q.json()
              setItems((prev) =>
                prev.map((p) =>
                  p.symbol === it.symbol
                    ? { ...p, price: dq?.quote?.c, change: dq?.quote?.dp }
                    : p
                )
              )
            } catch (e) {
              console.error('quote fetch error', e)
            }
          }
        )
      )
    } catch (error) {
      console.error('Failed fetching watchlist', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleWatchlistChange = (symbol: string, added: boolean) => {
    if (!added) {
      // removed -> remove from list
      setItems((s) => s.filter((it) => it.symbol !== symbol))
    }
  }

  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      // Call DELETE API
      const res = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      })
      if (!res.ok) throw new Error('Failed to remove')
      // Remove from UI after successful API call
      handleWatchlistChange(symbol, false)
    } catch (error) {
      console.error('Failed to remove from watchlist', error)
    }
  }

  if (loading) return <div className="text-gray-400">Loading watchlist...</div>

  if (!items || items.length === 0)
    return (
      <div className="text-gray-400">
        Your watchlist is empty. Use the search to add stocks to your watchlist.
      </div>
    )

  return (
    <div className="watchlist-table">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((it) => (
          <div
            key={it.symbol}
            className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-xl p-5 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 backdrop-blur-sm"
          >
            {/* Header with Company Name & Close Button */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Link
                  href={`/stocks/${it.symbol}`}
                  className="text-xl font-bold text-gray-100 hover:text-yellow-400 transition-colors block"
                >
                  {it.company}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono text-gray-400 bg-gray-800/60 px-2 py-1 rounded">
                    {it.symbol}
                  </span>
                  <span className="text-xs text-gray-500">
                    Added{' '}
                    {it.addedAt
                      ? new Date(it.addedAt).toLocaleDateString()
                      : '—'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromWatchlist(it.symbol)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-400 ml-2"
                title="Remove from watchlist"
                aria-label="Remove from watchlist"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chart */}
            <div className="mb-4">
              <div className="h-28 w-full overflow-hidden rounded-lg border border-gray-700/50 bg-gray-900/50">
                <TradingViewWidget
                  scriptUrl={`https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js`}
                  config={{
                    ...BASELINE_WIDGET_CONFIG(it.symbol),
                    width: '100%',
                    height: 112,
                  }}
                  height={112}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Price & Change Footer */}
            <div className="flex items-end justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Current Price</div>
                <div className="text-3xl font-bold text-gray-100">
                  {it.price ? `$${it.price.toFixed(2)}` : '—'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Change</div>
                <div
                  className={`text-2xl font-bold ${
                    it.change && it.change > 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {typeof it.change === 'number'
                    ? `${it.change > 0 ? '+' : ''}${it.change.toFixed(2)}%`
                    : '—'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WatchlistTable
