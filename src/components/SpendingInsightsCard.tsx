import { SpendingInsight } from '@/lib/spendingInsights'

interface Props {
  insights: SpendingInsight[]
}

const iconMap = {
  increase: '📈',
  decrease: '📉',
  top_category: '🏆',
  daily_average: '📊',
}

export function SpendingInsightsCard({ insights }: Props) {
  if (insights.length === 0) return null

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-3">💡 Spending Insights</h3>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
            <span className="text-xl">{iconMap[insight.type]}</span>
            <p className="text-sm text-gray-700">{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
