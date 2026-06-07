import { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  value: string
  label: string
  trend?: {
    value: string
    positive: boolean
  }
  color?: string
}

export default function StatCard({ icon, value, label, trend, color = 'text-purple-400' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gray-50 ${color}`}>{icon}</div>
      </div>
    </div>
  )
}
