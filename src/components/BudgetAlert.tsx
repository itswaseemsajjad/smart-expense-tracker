interface Props {
  category: string
  spent: number
  budget: number
}

export function BudgetAlert({ category, spent, budget }: Props) {
  const percentage = (spent / budget) * 100

  if (percentage < 80) return null

  const isOver = percentage >= 100

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl text-sm ${isOver ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
      <span className="text-lg shrink-0">{isOver ? '🚨' : '⚠️'}</span>
      <div>
        <p className={`font-medium ${isOver ? 'text-red-700' : 'text-yellow-700'}`}>
          {isOver ? `Over budget on ${category}!` : `${category} budget at ${Math.round(percentage)}%`}
        </p>
        <p className={`text-xs mt-0.5 ${isOver ? 'text-red-600' : 'text-yellow-600'}`}>
          Spent ${spent.toFixed(2)} of ${budget.toFixed(2)} budget
          {isOver && ` (${(spent - budget).toFixed(2)} over)`}
        </p>
      </div>
    </div>
  )
}
