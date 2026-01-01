import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import BalanceCard from '../components/dashboard/BalanceCard';
import SummaryCards from '../components/dashboard/SummaryCards';
import SpendingChart from '../components/dashboard/SpendingChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetSummary from '../components/dashboard/BudgetSummary';
import StatsShortcut from '../components/dashboard/StatsShortcut';

import WalletCards from '../components/dashboard/WalletCards';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
            {/* Mobile Header with Settings */}
            <div className="flex items-center justify-between lg:hidden">
                <Link to="/profile" className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Settings className="w-6 h-6" />
                </Link>
                <span className="font-bold text-slate-900 dark:text-white">Finance Dashboard</span>
                <div className="w-10"></div> {/* Spacer for balance */}
            </div>

            <div className="grid grid-cols-1 gap-6">
                <BalanceCard />
                <QuickActions />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatsShortcut />
                    <SummaryCards />
                </div>
                <WalletCards />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BudgetSummary />
                    <SpendingChart />
                </div>
            </div>

            {/* Recent Transactions - Full Width Bottom */}
            <div className="w-full">
                <RecentTransactions />
            </div>
        </div>
    );
}
