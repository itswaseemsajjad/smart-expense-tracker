interface BudgetProgressProps {
  category: string
  spent: number
  budget: number
}

export default function BudgetProgress({ category, spent, budget }: BudgetProgressProps) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const isOverBudget = spent > budget

  let barColor = 'bg-green-500'
  if (percentage > 80) barColor = 'bg-red-500'
  else if (percentage > 60) barColor = 'bg-yellow-500'

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">{category}</span>
        <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
          ${spent.toFixed(2)} / ${budget.toFixed(2)}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-400">{percentage.toFixed(0)}% used</span>
        {percentage > 80 && (
          <span className="text-xs font-medium text-red-500">
            {isOverBudget ? 'Over budget!' : 'Almost over budget'}
          </span>
        )}
      </div>
    </div>
  )
}
