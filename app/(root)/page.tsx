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
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-200 relative overflow-hidden">
      {/* Ambient gradient lights */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-yellow-600/20 blur-[120px] rounded-full animate-[pulse_12s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 blur-[160px] rounded-full animate-[pulse_14s_ease-in-out_infinite]" />
      </div>

      <section className="container mx-auto px-6 py-24">
        {/* HERO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Smarter{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                watchlists
              </span>
              .<br />
              Faster{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                decisions
              </span>
              .
            </h1>
            <p className="text-lg text-gray-400 max-w-md mb-10 leading-relaxed">
              Build curated watchlists, get real-time signals, and visualize
              trends — all within a seamless, lightning-fast interface.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-500 text-black font-semibold shadow-lg shadow-yellow-500/20 hover:shadow-yellow-400/40 hover:scale-[1.03] transition-all duration-300"
              >
                🚀 Get started — free
              </Link>
              <Link
                href="/stocks/AAPL"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 transition-all duration-300"
              >
                🔍 Explore demo
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-8">
              {[
                { label: 'Active users', value: '50k+' },
                { label: 'Markets covered', value: '120+' },
                { label: 'Avg alert setup', value: '60s' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] ring-1 ring-white/10 backdrop-blur-sm">
              <Image
                src="/assets/images/dashboard.jpeg"
                alt="Dashboard preview"
                width={1100}
                height={700}
                className="w-full h-auto object-cover scale-[1.01] hover:scale-100 transition-transform duration-[2000ms] ease-out"
              />
            </div>
            <div className="absolute -bottom-6 left-6 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-5 py-3 rounded-xl shadow-lg backdrop-blur-sm border border-yellow-400/20">
              <div className="text-sm font-semibold">📈 Live demo</div>
              <div className="text-xs opacity-80">
                Real-time market snapshots
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Watchlists',
              subtitle: 'Curate and track',
              desc: 'Organize your stocks into focused lists and receive intelligent alerts tailored to your strategy.',
              icon: '📊',
            },
            {
              title: 'Sparklines',
              subtitle: 'Visualize trends instantly',
              desc: 'Get at-a-glance price movements through clean, real-time sparkline charts that load instantly.',
              icon: '📈',
            },
            {
              title: 'Alerts',
              subtitle: 'Actionable notifications',
              desc: 'Be notified of crucial price actions, volatility, and breaking market news — without delay.',
              icon: '🔔',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-6 bg-slate-900/60 rounded-xl border border-white/10 hover:border-yellow-400/40 hover:shadow-[0_0_25px_-5px_rgba(250,204,21,0.3)] transition-all duration-500 backdrop-blur-lg"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <div className="text-yellow-400 font-semibold mb-1">
                {feature.title}
              </div>
              <div className="text-lg font-medium text-white mb-2">
                {feature.subtitle}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <section className="mt-32 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            How Stoxy Empowers Smarter Trading
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-14">
            We combine precision analytics, lightning-fast execution, and an
            intuitive interface to help you spot opportunities before they move
            the market.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            {[
              {
                step: '1',
                title: 'Add Stocks Effortlessly',
                desc: 'Search by symbol or name and instantly add them to custom watchlists that update live.',
              },
              {
                step: '2',
                title: 'Get Real-time Insights',
                desc: 'Stay informed with up-to-the-second quotes, sparklines, and curated breaking news.',
              },
              {
                step: '3',
                title: 'Act on Signals',
                desc: 'Receive intelligent alerts when patterns emerge — powered by analytics built for speed.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-gradient-to-b from-slate-900/70 to-slate-800/40 rounded-2xl border border-white/10 hover:scale-[1.02] transition-transform duration-500"
              >
                <div className="text-5xl font-black text-yellow-500 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRO INSIGHTS SECTION */}
        <section className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Data-driven insights. Zero clutter.
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Stoxy blends lightning-fast data pipelines with modern design.
              You’ll see what matters — no noise, no lag, no distractions.
              Designed for both seasoned traders and curious newcomers.
            </p>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>• AI-powered pattern recognition</li>
              <li>• Cross-platform dashboards</li>
              <li>• Secure cloud sync and backups</li>
              <li>• Multi-exchange and multi-asset support</li>
            </ul>
          </div>

          <div className="relative">
            <Image
              src="/assets/images/dashboard-preview.png"
              alt="Analytics dashboard"
              width={900}
              height={600}
              className="rounded-2xl shadow-2xl ring-1 ring-white/10 object-cover"
            />
            <div className="absolute -bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-400 px-4 py-2 rounded-xl text-black font-semibold shadow-lg">
              Real-time performance metrics
            </div>
          </div>
        </section>

        {/* INTEGRATIONS */}
        <section className="mt-32 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Works with your favorite platforms
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Stoxy integrates with leading broker APIs, data feeds, and tools you
            already use — no friction, no setup headaches.
          </p>

          <div className="flex flex-wrap justify-center gap-8 opacity-90">
            {[
              'TradingView',
              'Yahoo Finance',
              'Binance',
              'Polygon.io',
              'Finnhub',
            ].map((name, i) => (
              <div
                key={i}
                className="px-6 py-3 bg-slate-800/40 border border-white/10 rounded-xl hover:border-yellow-500/40 transition-all duration-300"
              >
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section className="mt-32 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Simple, fair pricing
          </h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Start free, grow at your own pace. Advanced alerts, analytics, and
            AI signals are available in Pro.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['Basic watchlists', 'Live quotes', 'News feed'],
              },
              {
                name: 'Pro',
                price: '$19/mo',
                features: [
                  'Smart alerts',
                  'Pattern insights',
                  'Multi-asset watchlists',
                ],
              },
              {
                name: 'Elite',
                price: '$39/mo',
                features: [
                  'AI-powered predictions',
                  'Full analytics suite',
                  'Priority updates',
                ],
              },
            ].map((tier, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-yellow-400/40 transition-all duration-500"
              >
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {tier.name}
                </h3>
                <div className="text-3xl font-bold text-yellow-400 mb-4">
                  {tier.price}
                </div>
                <ul className="space-y-2 text-sm text-gray-400">
                  {tier.features.map((f, j) => (
                    <li key={j}>• {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* COMMUNITY CTA */}
        <section className="mt-32 text-center bg-gradient-to-r from-yellow-500/10 to-cyan-500/10 border border-white/10 p-14 rounded-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Join thousands of traders building their edge.
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            No clutter. No noise. Just clean, focused market intelligence.
            Whether you’re trading daily or investing long-term — Stoxy helps
            you stay one step ahead.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-yellow-500 text-black font-semibold shadow-lg hover:scale-[1.05] transition-transform duration-300"
          >
            Get Started Now
          </Link>
        </section>

        {/* FOOTER */}
        <footer className="mt-32 py-10 border-t border-white/10 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              © {new Date().getFullYear()}{' '}
              <span className="text-white font-semibold">Stoxy</span> — Built
              for focused traders.
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </section>
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
