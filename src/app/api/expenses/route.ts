import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = { userId }
    if (category) where.category = category
    if (search) {
      where.OR = [
        { description: { contains: search } },
        { category: { contains: search } },
      ]
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ])

    return NextResponse.json({ expenses, total, page })
  } catch (error) {
    console.error('GET expenses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { amount, category, description, date, receiptData } = await req.json()

    if (!amount || !category || !description) {
      return NextResponse.json({ error: 'Amount, category and description are required' }, { status: 400 })
    }

    const expense = await prisma.expense.create({
      data: {
        userId,
        amount: parseFloat(amount),
        category,
        description,
        date: date ? new Date(date) : new Date(),
        receiptData: receiptData || null,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('POST expense error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}