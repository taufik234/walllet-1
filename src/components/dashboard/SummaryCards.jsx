import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function SummaryCards() {
  const { stats } = useTransactions();
  if (!stats) return null;
  const ratio = stats.totalIncome > 0 ? Math.min((stats.totalExpense / stats.totalIncome) * 100, 100) : 0;

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={12} strokeWidth={2} className="text-income" />
            <span className="text-xs text-muted-foreground font-medium">Income</span>
          </div>
          <p className="text-lg font-bold text-foreground font-mono mt-0.5">{formatCurrency(stats.totalIncome)}</p>
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-full bg-income rounded-full" />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown size={12} strokeWidth={2} className="text-expense" />
            <span className="text-xs text-muted-foreground font-medium">Expense</span>
          </div>
          <p className="text-lg font-bold text-foreground font-mono mt-0.5">{formatCurrency(stats.totalExpense)}</p>
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-destructive rounded-full" style={{width:`${ratio}%`}} />
          </div>
        </div>
      </div>
    </Card>
  );
}
