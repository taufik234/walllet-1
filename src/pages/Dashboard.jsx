import { useState } from 'react';
import CalendarHeader from '@/components/dashboard/CalendarHeader';
import ModernBalanceCard from '@/components/dashboard/ModernBalanceCard';
import IncomeCard from '@/components/dashboard/IncomeCard';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SpendingChart from '@/components/dashboard/SpendingChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetSummary from '@/components/dashboard/BudgetSummary';
import StatsShortcut from '@/components/dashboard/StatsShortcut';
import WalletCards from '@/components/dashboard/WalletCards';
import QuickActions from '@/components/dashboard/QuickActions';
import { Separator } from '@/components/ui/separator';

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="pb-24 space-y-8">
      {/* Hero Section */}
      <div className="space-y-5">
        <CalendarHeader currentDate={currentDate} onDateChange={setCurrentDate} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ModernBalanceCard currentDate={currentDate} onDateChange={setCurrentDate} />
          <IncomeCard currentDate={currentDate} onDateChange={setCurrentDate} />
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Quick Actions + Stats */}
      <div className="space-y-4">
        <QuickActions />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
          <StatsShortcut />
          <div className="md:col-span-2">
            <SummaryCards />
          </div>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Wallets + Budget + Chart */}
      <div className="space-y-5">
        <WalletCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BudgetSummary />
          <SpendingChart />
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}
