import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from './NavItems'
import UserDropdown from './UserDropdown'
import {
  searchStocks,
  enrichSearchWithWatchlist,
} from '@/lib/actions/finnhub.actions'

const Header = async ({ user }: { user?: User | null }) => {
  let initialStocks = await searchStocks()

  // Enrich with watchlist status if user is logged in
  if (user?.email) {
    initialStocks = await enrichSearchWithWatchlist(initialStocks, user.email)
  }

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/icons/logo.svg"
            alt="Stoxy logo"
            width={140}
            height={32}
            className="h-8 w-auto cursor-pointer"
          />
          <span className="text-yellow-400 font-semibold text-lg">Stoxy</span>
        </Link>
        {user && (
          <nav className="hidden sm:block">
            <NavItems initialStocks={initialStocks} userEmail={user.email} />
          </nav>
        )}
        {/* If user is signed in show dropdown, otherwise show simple auth links */}
        {user ? (
          <UserDropdown user={user} initialStocks={initialStocks} />
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-gray-400 hover:text-yellow-500 font-medium transition-colors duration-150 ease-in-out transform hover:scale-105 px-3 py-1 rounded hover:bg-gray-800/30"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="hidden sm:inline-block px-3 py-1 rounded bg-yellow-500 text-yellow-900 font-semibold transition transform hover:scale-105 hover:shadow-md hover:bg-yellow-600"
            >
              Create account
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
