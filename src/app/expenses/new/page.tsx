'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Scan, Loader2 } from 'lucide-react'

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Education', 'Other']

export default function NewExpensePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [scanning, setScanning] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  const handleScanReceipt = async () => {
    if (!receiptFile) return
    setScanning(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1]
        const res = await fetch('/api/ai/scan-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 }),
        })
        const data = await res.json()
        if (data.amount) setAmount(data.amount.toString())
        if (data.category) setCategory(data.category)
        if (data.description) setDescription(data.description)
        setScanning(false)
      }
      reader.readAsDataURL(receiptFile)
    } catch (err) {
      setError('Failed to scan receipt')
      setScanning(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          description,
          date,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save expense')
      } else {
        router.push('/expenses')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/expenses" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Add Expense</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Receipt Upload */}
          <div className="mb-6 p-4 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Receipt Upload (Optional)</h3>
              {receiptFile && (
                <button
                  type="button"
                  onClick={handleScanReceipt}
                  disabled={scanning}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {scanning ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Scanning...</>
                  ) : (
                    <><Scan className="w-3 h-3" /> Scan with AI</>
                  )}
                </button>
              )}
            </div>
            <div
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-300" />
              <p className="text-sm text-gray-400">
                {receiptFile ? receiptFile.name : 'Click to upload receipt image'}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                placeholder="What did you spend on?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/expenses"
                className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg text-center hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  'Save Expense'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
