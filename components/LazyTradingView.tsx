'use client'

import React, { useState } from 'react'
import TradingViewWidget from './TradingViewWidget'
import Sparkline from './Sparkline'
import { BASELINE_WIDGET_CONFIG } from '@/lib/constants'

interface LazyTradingViewProps {
  symbol: string
  config?: Record<string, unknown>
  height?: number
  className?: string
  sparklineData?: number[]
  onExpand?: () => void
}

/**
 * Lazy-loads TradingView widget on hover/focus.
 * Shows lightweight sparkline initially for fast rendering.
 */
export default function LazyTradingView({
  symbol,
  config,
  height = 112,
  className = '',
  sparklineData = [],
  onExpand,
}: LazyTradingViewProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoadChart = () => {
    setIsLoaded(true)
    onExpand?.()
  }

  const finalConfig = config || BASELINE_WIDGET_CONFIG(symbol)

  return (
    <div
      className={`relative h-28 w-full rounded-lg border border-gray-700/50 bg-gray-900/50 overflow-hidden cursor-pointer hover:border-yellow-500/30 transition-colors ${className}`}
      onMouseEnter={handleLoadChart}
      onFocus={handleLoadChart}
    >
      {!isLoaded && (
        //     <div className="flex items-center justify-center h-full bg-gray-900/30 w-full p-2">
        //       <Sparkline
        //         data={sparklineData}
        //         height={height - 16}
        //         width={280}
        //         positive={
        //           sparklineData && sparklineData.length > 0
        //             ? sparklineData[sparklineData.length - 1] >
        //               (sparklineData[0] || 0)
        //             : undefined
        //         }
        //       />
        //     </div>
        //   ) : (
        <TradingViewWidget
          scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
          config={{
            ...finalConfig,
            width: '100%',
            height,
          }}
          height={height}
          className="rounded-lg"
        />
      )}
    </div>
  )
}
