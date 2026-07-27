import { useMemo } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Progress, ProgressIndicator } from '@/components/ui/progress';
import { Wallet } from 'lucide-react';

function Skeleton() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-16 bg-muted rounded animate-pulse" />
        <div className="h-3 w-14 bg-muted rounded animate-pulse" />
      </div>
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <div className="h-3 w-32 bg-muted rounded animate-pulse" />
          <div className="h-3 w-8 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-2 bg-muted rounded-full animate-pulse" />
      </div>
      <div className="grid grid-cols-2 divide-x divide-border border-t border-border pt-3">
        <div>
          <div className="h-3 w-12 bg-muted rounded animate-pulse mb-1" />
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="pl-3">
          <div className="h-3 w-16 bg-muted rounded animate-pulse mb-1" />
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
}

export default function BudgetSummary() {
  const { budgetStats } = useTransactions();
  if (!budgetStats) return <Skeleton />;

  const g = useMemo(() => {
    const tl = budgetStats.reduce((a,c)=>a+Number(c.limitAmount||0),0);
    const ts = budgetStats.reduce((a,c)=>a+c.spent,0);
    return{totalLimit:tl,totalSpent:ts,totalRemaining:tl-ts,percentage:tl>0?(ts/tl)*100:0};
  }, [budgetStats]);

  if (g.totalLimit === 0) {
    return (
      <Card className="p-5 text-center">
        <Wallet size={32} strokeWidth={1} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium text-muted-foreground">Belum ada budget</p>
        <Link to="/budget" className="text-sm font-medium text-primary hover:text-primary/80 mt-1.5 inline-block">Atur Budget &rarr;</Link>
      </Card>
    );
  }

  const isOver = g.percentage > 100;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet size={16} strokeWidth={1.5} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Budget</h3>
        </div>
        <Link to="/budget" className="text-xs font-medium text-primary hover:text-primary/80">Details &rarr;</Link>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Limit: <span className="font-semibold text-foreground font-mono">{formatCurrency(g.totalLimit)}</span></span>
          <span className={`font-semibold ${isOver ? 'text-expense' : g.percentage > 80 ? 'text-primary' : 'text-muted-foreground'}`}>
            {Math.min(g.percentage, 100).toFixed(0)}%
          </span>
        </div>
        <Progress value={Math.min(g.percentage, 100)} className="h-2 rounded-full bg-muted">
          <ProgressIndicator
            className={`rounded-full transition-all duration-500 ${
              isOver
                ? 'bg-destructive'
                : g.percentage > 80
                  ? 'bg-primary'
                  : 'bg-primary/60'
            }`}
            style={{ width: `${Math.min(g.percentage, 100)}%` }}
          />
        </Progress>
      </div>
      <div className="grid grid-cols-2 divide-x divide-border border-t border-border pt-3 mt-3">
        <div>
          <p className="text-xs text-muted-foreground">Terpakai</p>
          <p className={`text-base font-semibold font-mono mt-0.5 ${isOver ? 'text-destructive' : 'text-foreground'}`}>
            {formatCurrency(g.totalSpent)}
          </p>
        </div>
        <div className="pl-3">
          <p className="text-xs text-muted-foreground">Sisa</p>
          <p className={`text-base font-semibold font-mono mt-0.5 ${g.totalRemaining < 0 ? 'text-destructive' : 'text-foreground'}`}>
            {formatCurrency(g.totalRemaining)}
          </p>
        </div>
      </div>
    </Card>
  );
}
