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
