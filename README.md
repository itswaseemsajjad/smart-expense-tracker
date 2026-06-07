# Smart Expense Tracker

AI-powered expense tracking application with receipt scanning, auto-categorization, budget alerts, and analytics.

## Features

- **AI Receipt Scanning**: Upload receipt images and GPT-4o extracts amount, merchant, and category automatically
- **Auto-Categorization**: Smart expense categorization across 9 categories
- **Budget Alerts**: Set monthly budgets per category with visual progress bars and over-budget warnings
- **Analytics Charts**: Spending by category (PieChart) and monthly trends (LineChart/BarChart)
- **Secure Auth**: NextAuth credentials provider with bcrypt password hashing

## Setup

### 1. Clone and Install
```bash
git clone https://github.com/itswaseemsajjad/smart-expense-tracker.git
cd smart-expense-tracker
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and fill in:
- `OPENAI_API_KEY` - Your OpenAI API key (required for AI receipt scanning)
- `NEXTAUTH_SECRET` - Any random 32+ character string (e.g., run `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your app URL (default: `http://localhost:3000`)

### 3. Database Setup
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite via Prisma
- **Auth**: NextAuth.js
- **AI**: OpenAI GPT-4o (vision for receipt OCR)
- **Charts**: Recharts
- **Styling**: Tailwind CSS