import { Link } from 'react-router-dom';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { Wallet, ArrowRight, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const walletIcons = [
  'bg-orange-500/15 text-orange-500',
  'bg-blue-500/15 text-blue-500',
  'bg-purple-500/15 text-purple-500',
];

function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {[1,2,3].map(i => (
        <Card key={i} className="p-3 sm:p-4 flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-muted rounded animate-pulse" />
            <div className="h-3.5 sm:h-4 w-16 sm:w-20 bg-muted rounded animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function WalletCards({ onAddWallet }) {
  const { wallets, walletStats, loading } = useTransactions();
  if (loading || !wallets) return <Skeleton />;

  if (wallets.length === 0) {
    return (
      <Card className="p-6 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl bg-muted flex items-center justify-center">
          <Wallet size={20} strokeWidth={1.5} className="text-muted-foreground" aria-hidden="true" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">Belum ada dompet</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Buat dompet pertama untuk mulai mencatat transaksi</p>
        <Button onClick={onAddWallet} className="gap-2 text-xs sm:text-sm">
          <Plus size={14} /> Buat Dompet
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
      {wallets.map((wallet, idx) => {
        const b = walletStats[wallet._id] || 0;
        return (
          <Link key={wallet._id} to="/wallets" className="block group">
            <Card className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 hover:border-ink-3 transition-all duration-200 group-hover:shadow-sm">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${walletIcons[idx % walletIcons.length]}`}>
                <Wallet size={16} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-medium text-foreground block truncate">{wallet.name}</span>
                </div>
                <span className="text-[11px] sm:text-xs font-semibold font-mono text-foreground">{formatCurrency(b)}</span>
              </div>
              <ArrowRight size={12} strokeWidth={1.5} className="text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" aria-hidden="true" />
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
