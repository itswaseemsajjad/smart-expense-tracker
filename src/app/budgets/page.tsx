'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BudgetProgress from '@/components/budgets/BudgetProgress'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Education', 'Other']

interface Budget {
  id: string
  category: string
  amount: number
  month: string
  spent: number
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('Food')
  const [newAmount, setNewAmount] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchBudgets = async () => {
    const res = await fetch('/api/budgets')
    const data = await res.json()
    setBudgets(data.budgets || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: newCategory,
        amount: parseFloat(newAmount),
        month: format(new Date(), 'yyyy-MM'),
      }),
    })
    setNewAmount('')
    await fetchBudgets()
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Budgets - {format(new Date(), 'MMMM yyyy')}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Add Budget Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-600" /> Set Category Budget
          </h2>
          <form onSubmit={handleSaveBudget} className="flex gap-3">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number"
              step="0.01"
              min="1"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
              placeholder="Budget amount"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set Budget'}
            </button>
          </form>
        </div>

        {/* Budget List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Current Budgets</h2>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : budgets.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No budgets set for this month. Add one above!
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget) => (
                <BudgetProgress
                  key={budget.id}
                  category={budget.category}
                  spent={budget.spent}
                  budget={budget.amount}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
