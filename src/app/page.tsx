import Link from 'next/link'
import { BarChart3, Brain, Bell, Receipt, TrendingUp, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-purple-400" />
          <span className="text-xl font-bold">ExpenseAI</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-800/40 px-4 py-2 rounded-full text-purple-300 text-sm mb-8">
          <Brain className="w-4 h-4" />
          AI-Powered Financial Intelligence
        </div>
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Track Every Penny with{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Intelligence
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Automatically scan receipts, categorize expenses, set smart budgets, and get actionable
          insights — all powered by AI.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
          >
            Start Tracking Free
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to manage money smarter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Receipt className="w-6 h-6" />,
              title: 'AI Receipt Scanning',
              description:
                'Upload any receipt and our AI automatically extracts amount, merchant, and category in seconds.',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10',
            },
            {
              icon: <Brain className="w-6 h-6" />,
              title: 'Auto-Categorization',
              description:
                'GPT-4o intelligently categorizes every expense so you never have to manually sort transactions.',
              color: 'text-purple-400',
              bg: 'bg-purple-500/10',
            },
            {
              icon: <Bell className="w-6 h-6" />,
              title: 'Smart Budget Alerts',
              description:
                'Set budgets per category and get visual warnings when you\'re approaching your limits.',
              color: 'text-yellow-400',
              bg: 'bg-yellow-500/10',
            },
            {
              icon: <BarChart3 className="w-6 h-6" />,
              title: 'Analytics Charts',
              description:
                'Beautiful charts showing spending trends, category breakdowns, and monthly comparisons.',
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              title: 'Spending Insights',
              description:
                'Understand your spending patterns with detailed monthly trend analysis and forecasting.',
              color: 'text-pink-400',
              bg: 'bg-pink-500/10',
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Secure & Private',
              description:
                'Your financial data is encrypted and stored securely. We never share your information.',
              color: 'text-indigo-400',
              bg: 'bg-indigo-500/10',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bg} ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 border border-purple-500/30 rounded-3xl p-16">
          <h2 className="text-4xl font-bold mb-4">Ready to take control of your finances?</h2>
          <p className="text-gray-300 mb-8 text-lg">Join thousands of users tracking smarter with AI</p>
          <Link
            href="/auth/register"
            className="inline-block px-10 py-4 bg-white text-purple-900 font-bold rounded-xl text-lg hover:bg-gray-100 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        © 2024 ExpenseAI. Track every penny with AI intelligence.
      </footer>
    </div>
  )
}
