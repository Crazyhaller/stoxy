import WatchlistTable from '@/components/WatchlistTable'

import React from 'react'

const Page = async () => {
  return (
    <div className="min-h-screen">
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">My Watchlist</h1>
            <p className="text-gray-400">
              Manage stocks you follow. Add or remove items from your watchlist.
            </p>
          </div>
        </div>

        <WatchlistTable />
      </div>
    </div>
  )
}

export default Page
