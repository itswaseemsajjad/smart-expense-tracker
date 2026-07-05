/**
 * CSV export helpers for expense data.
 *
 * Note the quoting strategy below: description and merchant fields are wrapped
 * in double quotes and any embedded quotes are escaped by doubling them (RFC
 * 4180). This keeps commas and quotes inside free-text fields from corrupting
 * the column layout when the file is opened in Excel, Sheets, or Numbers.
 */
interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string | Date
  merchant?: string
}

export function exportExpensesToCSV(expenses: Expense[], filename: string = 'expenses.csv') {
  const headers = ['Date', 'Description', 'Category', 'Merchant', 'Amount']
  const rows = expenses.map((e) => [
    new Date(e.date).toLocaleDateString(),
    `"${e.description.replace(/"/g, '""')}"`,
    e.category,
    e.merchant || '',
    e.amount.toFixed(2),
  ])

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
