import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { format, startOfMonth, endOfMonth } from 'date-fns'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const now = new Date()
    const currentMonth = format(now, 'yyyy-MM')
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const budgets = await prisma.budget.findMany({
      where: { userId, month: currentMonth },
    })

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await prisma.expense.findMany({
          where: {
            userId,
            category: budget.category,
            date: { gte: monthStart, lte: monthEnd },
          },
        })
        const spent = expenses.reduce((sum, e) => sum + e.amount, 0)
        return { ...budget, spent }
      })
    )

    return NextResponse.json({ budgets: budgetsWithSpending })
  } catch (error) {
    console.error('GET budgets error:', error)
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
    const { category, amount, month } = await req.json()

    if (!category || !amount || !month) {
      return NextResponse.json({ error: 'Category, amount, and month are required' }, { status: 400 })
    }

    const budget = await prisma.budget.upsert({
      where: { userId_category_month: { userId, category, month } },
      update: { amount: parseFloat(amount) },
      create: { userId, category, amount: parseFloat(amount), month },
    })

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error('POST budget error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}