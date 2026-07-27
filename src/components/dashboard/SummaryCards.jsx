import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

function Skeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-4 sm:p-5 space-y-2">
          <div className="h-3.5 sm:h-4 w-14 sm:w-16 bg-muted rounded animate-pulse" />
          <div className="h-6 sm:h-7 w-24 sm:w-28 bg-muted rounded animate-pulse" />
          <div className="h-1.5 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="p-4 sm:p-5 space-y-2">
          <div className="h-3.5 sm:h-4 w-14 sm:w-16 bg-muted rounded animate-pulse" />
          <div className="h-6 sm:h-7 w-24 sm:w-28 bg-muted rounded animate-pulse" />
          <div className="h-1.5 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </Card>
  );
}

export default function SummaryCards() {
  const { stats, loading } = useTransactions();
  if (loading || !stats) return <Skeleton />;
  const ratio = stats.totalIncome > 0 ? Math.min((stats.totalExpense / stats.totalIncome) * 100, 100) : 0;

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp size={11} strokeWidth={2} className="text-income" aria-hidden="true" />
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">Income</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground font-mono mt-0.5">{formatCurrency(stats.totalIncome)}</p>
          <div className="mt-2.5 sm:mt-3 h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} aria-label="Total income">
            <div className="h-full w-full bg-income rounded-full" />
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown size={11} strokeWidth={2} className="text-expense" aria-hidden="true" />
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">Expense</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground font-mono mt-0.5">{formatCurrency(stats.totalExpense)}</p>
          <div className="mt-2.5 sm:mt-3 h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={ratio} aria-valuemin={0} aria-valuemax={100} aria-label="Expense to income ratio">
            <div className="h-full bg-destructive rounded-full motion-safe:transition-all motion-safe:duration-500" style={{width:`${ratio}%`}} />
          </div>
        </div>
      </div>
    </Card>
  );
}
