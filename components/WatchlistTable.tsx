'use client'

import React, { useEffect, useState } from 'react'
import LazyTradingView from './LazyTradingView'
import Link from 'next/link'
import { generateSparklineData } from '@/lib/utils/sparkline'

interface WatchlistItem {
  symbol: string
  company: string
  addedAt?: string
}

interface TableItem extends WatchlistItem {
  price?: number
  change?: number
}

interface WatchlistTableProps {
  initialItems?: WatchlistItem[]
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({
  initialItems = [],
}) => {
  const [items, setItems] = useState<TableItem[]>(initialItems)
  const [loading, setLoading] = useState(
    !initialItems || initialItems.length === 0
  )

  const fetchItems = async () => {
    // If we already have initial items from server, fetch quotes only
    if (items.length > 0 && initialItems && initialItems.length > 0) {
      try {
        if (items.length > 0) {
          const symbolsArray = items.map((it: TableItem) => it.symbol)
          const quotesRes = await fetch('/api/finnhub/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbols: symbolsArray }),
          })
          if (!quotesRes.ok) throw new Error('Failed to fetch quotes')

          const quotesData = await quotesRes.json()
          const quotesBySymbol = (quotesData.quotes || []).reduce(
            (
              acc: Record<string, unknown>,
              q: { symbol: string; quote: unknown }
            ) => {
              acc[q.symbol] = q.quote
              return acc
            },
            {}
          )

          // Update all items with quotes
          setItems((prev) =>
            prev.map((p) => {
              const quote = quotesBySymbol[p.symbol]
              return {
                ...p,
                price: quote?.c as number | undefined,
                change: quote?.dp as number | undefined,
              }
            })
          )
        }
      } catch (error) {
        console.error('Failed to fetch batch quotes', error)
      } finally {
        setLoading(false)
      }
      return
    }

    // Otherwise fetch both items and quotes
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

      // Fetch all quotes in one batch request
      if (mapped.length > 0) {
        try {
          const symbolsArray = mapped.map(
            (it: { symbol: string; company: string; addedAt?: string }) =>
              it.symbol
          )
          const quotesRes = await fetch('/api/finnhub/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbols: symbolsArray }),
          })
          if (!quotesRes.ok) throw new Error('Failed to fetch quotes')

          const quotesData = await quotesRes.json()
          const quotesBySymbol = (quotesData.quotes || []).reduce(
            (
              acc: Record<string, unknown>,
              q: { symbol: string; quote: unknown }
            ) => {
              acc[q.symbol] = q.quote
              return acc
            },
            {}
          )

          // Update all items with quotes
          setItems((prev) =>
            prev.map((p) => {
              const quote = quotesBySymbol[p.symbol]
              return {
                ...p,
                price: quote?.c as number | undefined,
                change: quote?.dp as number | undefined,
              }
            })
          )
        } catch (error) {
          console.error('Failed to fetch batch quotes', error)
        }
      }
    } catch (error) {
      console.error('Failed fetching watchlist', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <LazyTradingView
                symbol={it.symbol}
                height={112}
                className="rounded-lg"
                sparklineData={generateSparklineData(it.price, it.change)}
              />
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
