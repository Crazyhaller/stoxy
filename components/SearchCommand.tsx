'use client'

import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Loader2, TrendingUp } from 'lucide-react'
import WatchlistButton from './WatchlistButton'
import Link from 'next/link'
import {
  searchStocks,
  searchStocksWithWatchlist,
} from '@/lib/actions/finnhub.actions'
import { useDebounce } from '@/hooks/useDebounce'

export default function SearchCommand({
  renderAs = 'button',
  label = 'Add stock',
  initialStocks,
  userEmail,
}: SearchCommandProps & { userEmail?: string }) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks)
  const [watchlistSet, setWatchlistSet] = useState<Set<string> | null>(null)

  const isSearchMode = !!searchTerm.trim()
  // Derive displayed stocks and ensure watchlist status is applied using the fetched watchlistSet
  const displayStocks = (isSearchMode ? stocks : stocks?.slice(0, 10))?.map(
    (s) => ({
      ...s,
      isInWatchlist: watchlistSet
        ? watchlistSet.has(s.symbol.toUpperCase())
        : !!s.isInWatchlist,
    })
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Fetch user's watchlist symbols client-side to ensure the UI reflects current DB state
  useEffect(() => {
    if (!userEmail) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/watchlist')
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        const set = new Set<string>(
          (data.items || []).map((i: unknown) =>
            String((i as { symbol?: string }).symbol ?? '').toUpperCase()
          )
        )
        setWatchlistSet(set)
        // apply to current stocks
        setStocks((prev) =>
          prev.map((s) => ({
            ...s,
            isInWatchlist: set.has(s.symbol.toUpperCase()),
          }))
        )
      } catch (e) {
        console.error('Failed to fetch watchlist symbols', e)
      }
    })()
    return () => {
      mounted = false
    }
  }, [userEmail])

  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks)

    setLoading(true)

    try {
      const results = userEmail
        ? await searchStocksWithWatchlist(searchTerm.trim(), userEmail)
        : await searchStocks(searchTerm.trim())
      // If we have a client-side watchlist set, ensure results align with it
      if (watchlistSet) {
        setStocks(
          results.map((r) => ({
            ...r,
            isInWatchlist: watchlistSet.has(r.symbol.toUpperCase()),
          }))
        )
      } else {
        setStocks(results)
      }
    } catch {
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300)

  useEffect(() => {
    debouncedSearch()
  }, [searchTerm, debouncedSearch])

  const handleSelectStock = () => {
    setOpen(false)
    setSearchTerm('')
    setStocks(initialStocks)
  }

  return (
    <>
      {renderAs === 'text' ? (
        <span
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpen(true)
            }
          }}
          className="search-text"
        >
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="search-dialog"
      >
        <div className="search-field">
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search stocks..."
            className="search-input"
          />
          {loading && <Loader2 className="search-loader" />}
        </div>
        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">
              Loading stocks...
            </CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? 'No results found' : 'No stocks available'}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? 'Search results' : 'Popular stocks'}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock) => (
                <li key={stock.symbol} className="search-item">
                  <div className="search-item-row flex items-center justify-between gap-3">
                    <Link
                      href={`/stocks/${stock.symbol}`}
                      onClick={handleSelectStock}
                      className="search-item-link flex items-center gap-3 flex-1"
                    >
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="search-item-name">{stock.name}</div>
                        <div className="text-sm text-gray-500">
                          {stock.symbol} | {stock.exchange} | {stock.type}
                        </div>
                      </div>
                    </Link>
                    <div className="search-item-action ml-3 flex-shrink-0">
                      <WatchlistButton
                        type="icon"
                        symbol={stock.symbol}
                        company={stock.name}
                        isInWatchlist={!!stock.isInWatchlist}
                        onWatchlistChange={(symbol, added) => {
                          setStocks((prev) =>
                            prev?.map((s) =>
                              s.symbol === symbol
                                ? { ...s, isInWatchlist: added }
                                : s
                            )
                          )
                          // keep client-side watchlist set in sync
                          setWatchlistSet((prevSet) => {
                            try {
                              const copy = new Set<string>(
                                prevSet ? Array.from(prevSet) : []
                              )
                              if (added) copy.add(symbol.toUpperCase())
                              else copy.delete(symbol.toUpperCase())
                              return copy
                            } catch {
                              return prevSet
                            }
                          })
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
