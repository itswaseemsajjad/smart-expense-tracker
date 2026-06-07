'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DataItem {
  month: string
  total: number
}

interface MonthlyLineChartProps {
  data: DataItem[]
}

export default function MonthlyLineChart({ data }: MonthlyLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No trend data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
        <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total Spent']} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: '#8b5cf6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
