import React from 'react';
import BalanceCard from '../components/dashboard/BalanceCard';
import SummaryCards from '../components/dashboard/SummaryCards';
import SpendingChart from '../components/dashboard/SpendingChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetSummary from '../components/dashboard/BudgetSummary';

export default function Dashboard() {
    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column (Stats) */}
                <div className="space-y-6">
                    <BalanceCard />
                    <SummaryCards />
                    <BudgetSummary />
                    <SpendingChart />
                </div>

                {/* Right Column (Recent Transactions) */}
                <div className="lg:pl-4">
                    <RecentTransactions />
                </div>
            </div>
        </div>
    );
}
