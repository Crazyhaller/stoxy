import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/database/mongoose'
import { Watchlist } from '@/database/models/watchlist.model'
import { auth } from '@/lib/better-auth/auth'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
      }
    : undefined

  try {
    const mongoose = await connectToDatabase()
    const db = mongoose.connection.db
    const session = await auth.api.getSession({
      headers: request.headers as unknown as Headers,
    })
    if (!session?.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = user?.email
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean()
    return NextResponse.json({ items })
  } catch (error) {
    console.error('GET /api/watchlist error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
      }
    : undefined

  try {
    const mongoose = await connectToDatabase()
    const db = mongoose.connection.db
    const session = await auth.api.getSession({
      headers: request.headers as unknown as Headers,
    })
    if (!session?.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = user?.email
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const symbol = String(body.symbol || '')
      .toUpperCase()
      .trim()
    const company = String(body.company || symbol)
    if (!symbol)
      return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 })

    try {
      await Watchlist.create({ userId, symbol, company })
    } catch (err) {
      // ignore duplicate key errors
      // err might be a MongoError with code 11000 for duplicates
      const maybeCode = (err as any)?.code
      if (String(maybeCode) !== '11000') {
        console.error('Error creating watchlist item', err)
        return NextResponse.json({ error: 'Failed to add' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST /api/watchlist error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
      }
    : undefined

  try {
    const mongoose = await connectToDatabase()
    const db = mongoose.connection.db
    const session = await auth.api.getSession({
      headers: request.headers as unknown as Headers,
    })
    if (!session?.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = user?.email
    if (!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const symbol = String(body.symbol || '')
      .toUpperCase()
      .trim()
    if (!symbol)
      return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 })

    await Watchlist.deleteOne({ userId, symbol })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/watchlist error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
