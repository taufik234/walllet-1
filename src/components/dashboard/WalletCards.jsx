import { Link } from 'react-router-dom';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { Wallet, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const walletIcons = [
  'bg-orange-500/15 text-orange-500',
  'bg-blue-500/15 text-blue-500',
  'bg-purple-500/15 text-purple-500',
];

export default function WalletCards() {
  const { wallets, walletStats } = useTransactions();
  if (!wallets) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {wallets.map((wallet, idx) => {
        const b = walletStats[wallet._id] || 0;
        return (
          <Link key={wallet._id} to="/wallets">
            <Card className="p-4 flex items-center gap-3 hover:border-ink-3 transition-all duration-200 cursor-pointer">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${walletIcons[idx % walletIcons.length]}`}>
                <Wallet size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-foreground block truncate">{wallet.name}</span>
                </div>
                <span className="text-xs font-semibold font-mono text-foreground">{formatCurrency(b)}</span>
              </div>
              <ArrowRight size={14} strokeWidth={1.5} className="text-muted-foreground/40 shrink-0" />
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
