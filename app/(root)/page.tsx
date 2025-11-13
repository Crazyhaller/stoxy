import Image from 'next/image'
import Link from 'next/link'
import TradingViewWidget from '@/components/TradingViewWidget'
import { headers } from 'next/headers'
import { auth } from '@/lib/better-auth/auth'
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from '@/lib/constants'

const Dashboard = () => {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`

  return (
    <div className="flex min-h-screen home-wrapper">
      <section className="grid w-full gap-8 home-section">
        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            title="Market Overview"
            scriptUrl={`${scriptUrl}market-overview.js`}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            className="custom-chart"
            height={600}
          />
        </div>
        <div className="md:col-span-1 xl:col-span-2">
          <TradingViewWidget
            title="Stock Heatmap"
            scriptUrl={`${scriptUrl}stock-heatmap.js`}
            config={HEATMAP_WIDGET_CONFIG}
            height={600}
          />
        </div>
      </section>
      <section className="grid w-full gap-8 home-section">
        <div className="h-full md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}timeline.js`}
            config={TOP_STORIES_WIDGET_CONFIG}
            className="custom-chart"
            height={600}
          />
        </div>
        <div className="h-full md:col-span-1 xl:col-span-2">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}market-quotes.js`}
            config={MARKET_DATA_WIDGET_CONFIG}
            height={600}
          />
        </div>
      </section>
    </div>
  )
}

const Landing = () => {
  return (
    <main className="min-h-screen flex items-center text-gray-200">
      <div className="container py-20 flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Invest with confidence.
          </h1>
          <p className="text-gray-400 mb-6">
            Track the market, build a watchlist, and stay ahead with real-time
            market data and insights.
          </p>
          <div className="flex gap-4">
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded bg-transparent border border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 rounded bg-yellow-500 text-yellow-900 font-semibold"
            >
              Create account
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            src="/assets/images/dashboard.jpeg"
            alt="Dashboard preview"
            width={900}
            height={600}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </main>
  )
}

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return <Landing />
  }

  return <Dashboard />
}

export default Page
