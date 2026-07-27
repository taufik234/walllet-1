import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTransactions } from '@/context/TransactionContext';

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const { wallets, createWallet } = useTransactions();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');

  const hAddWallet = async (e) => {
    e.preventDefault();
    if (!newName) return;
    try {
      await createWallet(newName, Number(newBalance.replace(/\./g,'')) || 0);
      setNewName('');
      setNewBalance('');
      setIsWalletOpen(false);
    } catch {}
  };

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
        <WalletCards onAddWallet={() => setIsWalletOpen(true)} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BudgetSummary />
          <SpendingChart />
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Recent Transactions */}
      <RecentTransactions />

      {/* Add Wallet Dialog */}
      <Dialog open={isWalletOpen} onOpenChange={setIsWalletOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Dompet Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={hAddWallet} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Nama Dompet</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Bank Mandiri"
                autoFocus
                required
                className="w-full bg-background border border-input rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Saldo Awal (opsional)</label>
              <input
                type="text"
                inputMode="numeric"
                value={newBalance}
                onChange={e => setNewBalance(e.target.value.replace(/\D/g,'') ? new Intl.NumberFormat('id-ID').format(Number(e.target.value.replace(/\D/g,''))) : '')}
                placeholder="0"
                className="w-full bg-background border border-input rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button type="submit" disabled={!newName} className="w-full">
              Buat Dompet
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
