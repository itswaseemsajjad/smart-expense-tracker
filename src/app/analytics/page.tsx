'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SpendingPieChart from '@/components/charts/SpendingPieChart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AnalyticsData {
  byCategory: { category: string; total: number }[]
  monthlyTrend: { month: string; total: number }[]
  stats: { totalMonth: number; avgExpense: number; count: number }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Analytics</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-1">This Month Total</p>
            <p className="text-3xl font-bold text-gray-900">${data?.stats.totalMonth.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-1">Average Expense</p>
            <p className="text-3xl font-bold text-gray-900">${data?.stats.avgExpense.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
            <p className="text-3xl font-bold text-gray-900">{data?.stats.count || 0}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Spending by Category</h2>
            <SpendingPieChart data={data?.byCategory || []} />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Monthly Spending (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.monthlyTrend || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']} />
                <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Category Breakdown</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {(data?.byCategory || []).sort((a, b) => b.total - a.total).map((item) => {
              const max = Math.max(...(data?.byCategory || []).map((d) => d.total))
              const pct = max > 0 ? (item.total / max) * 100 : 0
              return (
                <div key={item.category} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm font-semibold text-gray-900">${item.total.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
