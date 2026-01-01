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

            {/* Desktop Grid for Charts & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column (Main Stats) */}
                <div className="lg:col-span-2 space-y-6">
                    <BalanceCard />
                    <QuickActions />
                    <WalletCards />
                    <BudgetSummary />
                    <SpendingChart />
                </div>

                {/* Right Column (Secondary Stats) - Formerly RecentTransactions, now maybe shortcuts or summary? 
                    Actually, if RecentTransactions goes to bottom, what stays here?
                    SummaryCards & StatsShortcut?
                */}
                <div className="space-y-6">
                    <StatsShortcut />
                    <SummaryCards />
                    {/* We can put other small widgets here if needed, or just let the left col take more space */}
                </div>
            </div>

            {/* Recent Transactions - Full Width Bottom */}
            <div className="w-full">
                <RecentTransactions />
            </div>
        </div>
    );
}
