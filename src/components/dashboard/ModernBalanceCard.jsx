import { formatCurrency } from '@/utils/utils';
import { useTransactions } from '@/context/TransactionContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

function Skeleton() {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="w-2 h-2 rounded-full bg-primary/30" />
        <div className="h-3 w-20 sm:w-24 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-8 sm:h-12 w-40 sm:w-56 bg-muted rounded animate-pulse mb-5" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-14 sm:h-16 bg-muted rounded-lg animate-pulse" />
        <div className="h-14 sm:h-16 bg-muted rounded-lg animate-pulse" />
      </div>
    </Card>
  );
}

export default function ModernBalanceCard({ currentDate }) {
  const { stats, loading } = useTransactions();
  if (loading || !stats) return <Skeleton />;

  return (
    <Card className="p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-primary/3 blur-2xl pointer-events-none" aria-hidden="true" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground tracking-wide">Total Balance</span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full">
            {format(currentDate, 'MMM yyyy', { locale: id })}
          </span>
        </div>

        <p className="text-[1.75rem] sm:text-[2.75rem] font-bold text-foreground mb-4 sm:mb-5 tracking-tight leading-none font-mono">
          {formatCurrency(stats?.totalBalance || 0)}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 sm:p-3.5 border border-border/50">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={12} strokeWidth={2} className="text-income" aria-hidden="true" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Income</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-income font-mono">{formatCurrency(stats.totalIncome)}</p>
          </div>
          <div className="bg-background/80 backdrop-blur-sm rounded-xl p-3 sm:p-3.5 border border-border/50">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown size={12} strokeWidth={2} className="text-expense" aria-hidden="true" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Expense</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-expense font-mono">{formatCurrency(stats.totalExpense)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
