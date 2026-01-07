import React from 'react';
import CalendarHeader from '../components/dashboard/CalendarHeader';
import ModernBalanceCard from '../components/dashboard/ModernBalanceCard';
import IncomeCard from '../components/dashboard/IncomeCard';
import SummaryCards from '../components/dashboard/SummaryCards';
import SpendingChart from '../components/dashboard/SpendingChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import BudgetSummary from '../components/dashboard/BudgetSummary';
import StatsShortcut from '../components/dashboard/StatsShortcut';

import WalletCards from '../components/dashboard/WalletCards';
import QuickActions from '../components/dashboard/QuickActions';

export default function Dashboard() {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">

            <div className="grid grid-cols-1 gap-6">
                <CalendarHeader currentDate={currentDate} onDateChange={setCurrentDate} />
                <ModernBalanceCard currentDate={currentDate} onDateChange={setCurrentDate} />
                <IncomeCard currentDate={currentDate} onDateChange={setCurrentDate} />
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
