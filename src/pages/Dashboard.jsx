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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTransactions } from '@/context/TransactionContext';
import { Plus, AlertCircle, CreditCard, CircleDollarSign, ArrowUpDown } from 'lucide-react';

function SectionHeader({ icon, title, count, action }) {
  const Icon = icon;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Icon size={15} className="text-primary" />
        </div>
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        {count !== undefined && (
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-semibold">{count}</span>
        )}
      </div>
      {action}
    </div>
  );
}

export default function Dashboard() {
  const { createWallet, wallets } = useTransactions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState('');

  const hAddWallet = async (e) => {
    e.preventDefault();
    if (!newName) { setWalletError('Nama dompet harus diisi'); return; }
    setWalletLoading(true);
    setWalletError('');
    try {
      await createWallet(newName, Number(newBalance.replace(/\./g,'')) || 0);
      setNewName('');
      setNewBalance('');
      setIsWalletOpen(false);
    } catch (err) {
      setWalletError(err.message || 'Gagal membuat dompet');
    } finally {
      setWalletLoading(false);
    }
  };

  const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="pb-24 space-y-8 animate-in fade-in duration-500">
      {/* Welcome Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/20">
            <CircleDollarSign size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{monthName}</p>
          </div>
        </div>
        {(wallets?.length || 0) === 0 && (
          <Button onClick={() => setIsWalletOpen(true)} size="sm" className="gap-1.5 shadow-sm">
            <Plus size={14} /> Buat Dompet
          </Button>
        )}
      </div>

      {/* Hero: Calendar + Balance */}
      <div className="space-y-5">
        <CalendarHeader currentDate={currentDate} onDateChange={setCurrentDate} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ModernBalanceCard currentDate={currentDate} onDateChange={setCurrentDate} />
          <IncomeCard currentDate={currentDate} onDateChange={setCurrentDate} />
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <SectionHeader
          icon={CircleDollarSign}
          title="Quick Actions"
        />
        <QuickActions />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
          <StatsShortcut />
          <div className="md:col-span-2">
            <SummaryCards />
          </div>
        </div>
      </div>

      {/* Wallets + Budget + Chart */}
      <div className="space-y-4">
        <SectionHeader
          icon={CreditCard}
          title="Wallets & Budget"
          count={wallets?.length || 0}
          action={
            (wallets?.length || 0) > 0 && (
              <Button variant="outline" size="sm" onClick={() => setIsWalletOpen(true)} className="gap-1.5">
                <Plus size={14} /> Add Wallet
              </Button>
            )
          }
        />
        <WalletCards onAddWallet={() => setIsWalletOpen(true)} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BudgetSummary />
          <SpendingChart />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <SectionHeader
          icon={ArrowUpDown}
          title="Recent Transactions"
        />
        <RecentTransactions />
      </div>

      {/* Add Wallet Dialog */}
      <Dialog open={isWalletOpen} onOpenChange={(open) => { if (!open) { setIsWalletOpen(false); setWalletError(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Dompet Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={hAddWallet} className="space-y-4">
            <div>
              <label htmlFor="wallet-name" className="block text-xs font-medium text-muted-foreground mb-1.5">Nama Dompet</label>
              <input
                id="wallet-name"
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
              <label htmlFor="wallet-balance" className="block text-xs font-medium text-muted-foreground mb-1.5">Saldo Awal <span className="text-muted-foreground/60">(opsional)</span></label>
              <input
                id="wallet-balance"
                type="text"
                inputMode="numeric"
                value={newBalance}
                onChange={e => setNewBalance(e.target.value.replace(/\D/g,'') ? new Intl.NumberFormat('id-ID').format(Number(e.target.value.replace(/\D/g,''))) : '')}
                placeholder="0"
                className="w-full bg-background border border-input rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {walletError && (
              <div role="alert" className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{walletError}</span>
              </div>
            )}

            <Button type="submit" disabled={walletLoading || !newName} className="w-full gap-2">
              {walletLoading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Menyimpan...</>
              ) : (
                <><Plus size={16} /> Buat Dompet</>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
