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
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // By category this month
    const monthExpenses = await prisma.expense.findMany({
      where: { userId, date: { gte: monthStart, lte: monthEnd } },
    })

    const categoryMap = new Map<string, number>()
    for (const expense of monthExpenses) {
      categoryMap.set(expense.category, (categoryMap.get(expense.category) || 0) + expense.amount)
    }
    const byCategory = Array.from(categoryMap.entries()).map(([category, total]) => ({ category, total }))

    // Monthly trend
    const monthlyTrend: { month: string; total: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const start = startOfMonth(d)
      const end = endOfMonth(d)
      const expenses = await prisma.expense.findMany({
        where: { userId, date: { gte: start, lte: end } },
      })
      monthlyTrend.push({
        month: format(d, 'MMM'),
        total: expenses.reduce((sum, e) => sum + e.amount, 0),
      })
    }

    const totalMonth = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
    const avgExpense = monthExpenses.length > 0 ? totalMonth / monthExpenses.length : 0

    return NextResponse.json({
      byCategory,
      monthlyTrend,
      stats: { totalMonth, avgExpense, count: monthExpenses.length },
    })
  } catch (error) {
    console.error('GET analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}