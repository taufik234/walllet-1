# Finance Dashboard

A modern, responsive, and feature-rich Finance Dashboard application built with **React 19** and **Supabase**. This application allows users to track their income and expenses, manage budgets, visualize financial data, and handle multiple wallets in a seamless interface.


*(Note: You can replace this placeholder image with an actual screenshot of your dashboard)*

## 🚀 Key Features

- **📊 Interactive Dashboard**: innovative overview of your financial health with real-time charts and summary cards.
- **💸 Transaction Management**: Easily add, edit, and delete transactions. Categorize them as Income or Expense.
- **📉 Financial Statistics**: Visual breakdown of your spending habits using interactive charts (Recharts).
- **💰 Budget Control**: Set and monitor your monthly budgets to stay on track.
- **💳 Multi-Wallet Support**: Manage balances across different accounts (e.g., Cash, Bank, E-Wallet).
- **🔒 Secure Authentication**: Robust user authentication (Sign Up, Login) powered by Supabase.
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile devices using Tailwind CSS.
- **👤 User Profile**: customized profile settings and management.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Backend / Database**: [Supabase](https://supabase.com/)
- **State Management**: React Context API
- **Routing**: [React Router v6](https://reactrouter.com/)

## 📂 Project Structure

```bash
finance-dashboard/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── dashboard/    # Components specific to the dashboard page
│   │   ├── layout/       # Layout wrappers (AuthLayout, Layout, ProtectedRoute)
│   │   └── shared/       # Generic shared components (Cards, Buttons, Inputs)
│   ├── context/          # React Contexts (AuthContext, TransactionContext)
│   ├── lib/              # Library configurations (Supabase client)
│   ├── pages/            # Application pages (Dashboard, Transactions, Stats, etc.)
│   │   └── auth/         # Authentication pages (Login, Register)
│   ├── App.jsx           # Main application component with Routing
│   └── main.jsx          # Entry point
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── tailwind.config.js    # Tailwind CSS configuration
```

## ⚡ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/finance-dashboard.git
    cd finance-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory based on `.env.example`:
    ```bash
    cp .env.example .env
    ```
    
    Update `.env` with your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
