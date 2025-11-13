'use client'

import React, { useMemo } from 'react'

interface SparklineProps {
  data: number[]
  className?: string
  positive?: boolean
  height?: number
  width?: number
}

/**
 * Lightweight sparkline component using SVG.
 * Accepts an array of numbers and renders a simple line chart.
 * Use this as a fast placeholder before lazy-loading TradingView.
 */
export default function Sparkline({
  data,
  className = '',
  positive,
  height = 60,
  width = 100,
}: SparklineProps) {
  const { points } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: '' }
    }

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width
        const y = height - ((val - min) / range) * height
        return `${x},${y}`
      })
      .join(' ')

    return { points }
  }, [data, height, width])

  if (!points) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <span className="text-xs text-gray-500">No data</span>
      </div>
    )
  }

  return (
    <svg
      width={width}
      height={height}
      className={`${className}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#4ade80' : '#ef4444'}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
