import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import StatCard from '@/components/dashboard/StatCard'
import SpendingPieChart from '@/components/charts/SpendingPieChart'
import MonthlyLineChart from '@/components/charts/MonthlyLineChart'
import CategoryBadge from '@/components/expenses/CategoryBadge'
import { DollarSign, TrendingDown, Hash, ArrowUpRight, Plus, BarChart3, LogOut } from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/auth/login')
  }

  const userId = (session.user as any).id
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const [monthExpenses, allExpenses, budgets] = await Promise.all([
    prisma.expense.findMany({
      where: { userId, date: { gte: monthStart, lte: monthEnd } },
      orderBy: { date: 'desc' },
    }),
    prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    }),
    prisma.budget.findMany({
      where: { userId, month: format(now, 'yyyy-MM') },
    }),
  ])

  const totalSpentMonth = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const budgetRemaining = totalBudget - totalSpentMonth
  const biggestExpense = monthExpenses.reduce((max, e) => (e.amount > max ? e.amount : max), 0)

  const categoryMap = new Map<string, number>()
  for (const expense of monthExpenses) {
    categoryMap.set(expense.category, (categoryMap.get(expense.category) || 0) + expense.amount)
  }
  const byCategory = Array.from(categoryMap.entries()).map(([category, total]) => ({ category, total }))

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span className="text-lg font-bold text-gray-900">ExpenseAI</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-purple-600">Dashboard</Link>
            <Link href="/expenses" className="text-sm text-gray-600 hover:text-gray-900">Expenses</Link>
            <Link href="/budgets" className="text-sm text-gray-600 hover:text-gray-900">Budgets</Link>
            <Link href="/analytics" className="text-sm text-gray-600 hover:text-gray-900">Analytics</Link>
            <Link href="/api/auth/signout" className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
              <LogOut className="w-4 h-4" /> Sign Out
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
            <p className="text-gray-500 text-sm mt-1">{format(now, 'MMMM yyyy')} overview</p>
          </div>
          <Link
            href="/expenses/new"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            value={`$${totalSpentMonth.toFixed(2)}`}
            label="Total Spent This Month"
            color="text-purple-600"
          />
          <StatCard
            icon={<TrendingDown className="w-5 h-5" />}
            value={`$${budgetRemaining.toFixed(2)}`}
            label="Budget Remaining"
            color={budgetRemaining < 0 ? 'text-red-500' : 'text-green-600'}
          />
          <StatCard
            icon={<Hash className="w-5 h-5" />}
            value={monthExpenses.length.toString()}
            label="Transactions This Month"
            color="text-blue-600"
          />
          <StatCard
            icon={<ArrowUpRight className="w-5 h-5" />}
            value={`$${biggestExpense.toFixed(2)}`}
            label="Biggest Expense"
            color="text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h2>
            <SpendingPieChart data={byCategory} />
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h2>
            <MonthlyLineChart data={monthlyTrend} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
            <Link href="/expenses" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {allExpenses.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p>No expenses yet.</p>
                <Link href="/expenses/new" className="text-purple-600 text-sm mt-2 inline-block hover:underline">
                  Add your first expense
                </Link>
              </div>
            ) : (
              allExpenses.map((expense) => (
                <div key={expense.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CategoryBadge category={expense.category} />
                    <span className="text-gray-700 text-sm">{expense.description}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{format(new Date(expense.date), 'MMM d')}</span>
                    <span className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
