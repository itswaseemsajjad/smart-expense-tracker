interface Expense {
  amount: number
  category: string
  date: string | Date
}

export interface SpendingInsight {
  type: 'increase' | 'decrease' | 'top_category' | 'daily_average'
  message: string
  value?: number
}

export function generateInsights(expenses: Expense[]): SpendingInsight[] {
  if (expenses.length === 0) return []

  const insights: SpendingInsight[] = []
  const now = new Date()

  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const lastMonth = expenses.filter((e) => {
    const d = new Date(e.date)
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear()
  })

  const thisMonthTotal = thisMonth.reduce((s, e) => s + e.amount, 0)
  const lastMonthTotal = lastMonth.reduce((s, e) => s + e.amount, 0)

  if (lastMonthTotal > 0) {
    const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
    insights.push({
      type: change > 0 ? 'increase' : 'decrease',
      message: `Spending ${change > 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(0)}% vs last month`,
      value: change,
    })
  }

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]
  if (topCategory) {
    insights.push({
      type: 'top_category',
      message: `Highest spending: ${topCategory[0]} ($${topCategory[1].toFixed(0)})`,
      value: topCategory[1],
    })
  }

  if (thisMonth.length > 0) {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const dailyAvg = thisMonthTotal / Math.min(now.getDate(), daysInMonth)
    insights.push({
      type: 'daily_average',
      message: `Daily average this month: $${dailyAvg.toFixed(2)}`,
      value: dailyAvg,
    })
  }

  return insights
}
