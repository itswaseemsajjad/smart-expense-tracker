'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DataItem {
  category: string
  total: number
}

interface SpendingPieChartProps {
  data: DataItem[]
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6', '#f97316']

export default function SpendingPieChart({ data }: SpendingPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No spending data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="total"
          nameKey="category"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
        />
        <Legend
          formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
