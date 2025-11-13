import WatchlistTable from '@/components/WatchlistTable'
import { auth } from '@/lib/better-auth/auth'
import { headers } from 'next/headers'
import React from 'react'

interface WatchlistItem {
  symbol: string
  company: string
  addedAt?: string
}

const Page = async () => {
  // Fetch session server-side
  const session = await auth.api.getSession({ headers: await headers() })

  const userEmail = session?.user?.email

  // Pre-fetch watchlist server-side
  let initialItems: WatchlistItem[] = []
  if (userEmail) {
    try {
      // Call the internal Watchlist model directly server-side
      const { connectToDatabase } = await import('@/database/mongoose')
      const { Watchlist } = await import('@/database/models/watchlist.model')

      const mongoose = await connectToDatabase()
      const db = mongoose.connection.db
      if (db) {
        const user = await db
          .collection('user')
          .findOne<{ _id?: unknown; id?: string; email?: string }>({
            email: userEmail,
          })

        if (user) {
          const userId = (user.id as string) || String(user._id || '')
          if (userId) {
            const items = await Watchlist.find({ userId }).lean()
            initialItems = items.map(
              (i: {
                symbol?: string
                company?: string
                addedAt?: unknown
              }) => ({
                symbol: String(i.symbol || ''),
                company: String(i.company || ''),
                addedAt: (i.addedAt instanceof Date
                  ? i.addedAt.toISOString()
                  : String(i.addedAt || '')) as string | undefined,
              })
            )
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch initial watchlist server-side:', error)
    }
  }

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

        <WatchlistTable initialItems={initialItems} />
      </div>
    </div>
  )
}

export default Page
