'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CategoryBadge from '@/components/expenses/CategoryBadge'
import { Plus, Search, Trash2, BarChart3, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Education', 'Other']

interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

export default function ExpensesPage() {
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    const res = await fetch(`/api/expenses?${params}`)
    const data = await res.json()
    setExpenses(data.expenses || [])
    setLoading(false)
  }, [search, category])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
    fetchExpenses()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-bold text-gray-900">Expenses</span>
            </div>
          </div>
          <Link
            href="/expenses/new"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400 mb-4">No expenses found.</p>
              <Link href="/expenses/new" className="text-purple-600 hover:underline text-sm font-medium">
                Add your first expense
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {expenses.map((expense) => (
                <div key={expense.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <CategoryBadge category={expense.category} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                      <p className="text-xs text-gray-400">{format(new Date(expense.date), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</span>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
