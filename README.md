# Finance Dashboard

Personal finance dashboard for Indonesian users. Track income/expense, manage budgets, multi-wallet, goals, and visualize financial data.

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: Convex
- **Auth**: Convex Auth
- **Routing**: React Router v7

## Features

- Dashboard with balance card, spending chart, calendar, budget overview
- Transaction management with filters & search
- Financial statistics with trend comparison & category distribution
- Budget planning per category
- Savings goals tracker
- Multi-wallet support with balance adjustments
- Data export (Excel/PDF)
- Dark/light mode

## Project Structure

```
src/
├── components/
│   ├── dashboard/     # Dashboard-specific components
│   ├── goals/         # Savings goal modals
│   ├── layout/        # Sidebar, BottomNav, MobileHeader, Layout
│   ├── shared/        # SearchBar, filters, modals
│   ├── transactions/  # TransactionList, TransferModal, detail
│   └── ui/            # shadcn/ui primitives
├── context/           # AuthContext, ThemeContext, TransactionContext
├── pages/             # Dashboard, Transactions, Stats, Budget, Goals, Wallets, Profile
│   └── auth/          # Login, Register
└── App.jsx            # Routes
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Convex Setup

The app uses Convex as backend. Run Convex dev server:

```bash
npx convex dev
```

Set environment variables in `.env.local` as needed. See `convex/_generated/ai/guidelines.md` for Convex conventions.
