'use client'
import React, { useMemo, useState, useEffect } from 'react'

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = 'button',
  onWatchlistChange,
}: WatchlistButtonProps & { company?: string }) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist)

  // Sync internal state when prop changes (important for client-side updates)
  useEffect(() => {
    setAdded(!!isInWatchlist)
  }, [isInWatchlist])

  const label = useMemo(() => {
    if (type === 'icon') return added ? '' : ''
    return added ? 'Remove from Watchlist' : 'Add to Watchlist'
  }, [added, type])

  const callApi = async (next: boolean) => {
    try {
      if (next) {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol, company }),
        })
      } else {
        await fetch('/api/watchlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol }),
        })
      }
    } catch (error) {
      console.error('Watchlist API error', error)
    }
  }

  const handleClick = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const next = !added
    setAdded(next)
    // Optimistically update, then call API
    await callApi(next)
    onWatchlistChange?.(symbol, next)
  }

  if (type === 'icon') {
    return (
      <button
        title={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        aria-label={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
          added
            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
            : 'bg-gray-700/30 text-gray-400 hover:bg-yellow-500/20 hover:text-yellow-400'
        }`}
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={added ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
      </button>
    )
  }

  return (
    <button
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
        added
          ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50'
          : 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25 border border-yellow-500/30 hover:border-yellow-500/50'
      }`}
      onClick={handleClick}
    >
      {showTrashIcon && added ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 flex-shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6"
          />
        </svg>
      ) : null}
      <span>{label}</span>
    </button>
  )
}

export default WatchlistButton
