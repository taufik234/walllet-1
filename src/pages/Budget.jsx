import { useState, useMemo } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import {
  Plus, PencilLine, Trash2, RefreshCw, Wallet,
  TrendingUp, TrendingDown, AlertTriangle, Sparkles,
  PiggyBank, Gauge
} from 'lucide-react';
import AddBudgetModal from '@/components/shared/AddBudgetModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function BudgetProgressBar({ pct, isOver, size = 'md' }) {
  const h = size === 'lg' ? 'h-3' : 'h-2';
  const barColor = isOver
    ? 'bg-gradient-to-r from-destructive via-red-500 to-destructive'
    : pct > 80
      ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400'
      : pct > 50
        ? 'bg-gradient-to-r from-primary/80 to-primary'
        : 'bg-gradient-to-r from-primary/50 to-primary/80';

  return (
    <div className={`${h} bg-muted rounded-full overflow-hidden relative`}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
      {[33, 66].map(m => (
        <div
          key={m}
          className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-colors duration-500 ${
            pct >= m ? 'bg-white/50' : 'bg-muted-foreground/20'
          }`}
          style={{ left: `calc(${m}% - 2px)` }}
        />
      ))}
    </div>
  );
}

export default function Budget() {
  const { budgetStats, deleteBudget, budgets, categories, resetBudget } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const g = useMemo(() => {
    const tl = budgetStats.reduce((a, c) => a + Number(c.limitAmount || 0), 0);
    const ts = budgetStats.reduce((a, c) => a + Number(c.spent || 0), 0);
    return { totalLimit: tl, totalSpent: ts, totalRemaining: tl - ts, percentage: tl > 0 ? (ts / tl) * 100 : 0 };
  }, [budgetStats]);

  const overBudgetCount = useMemo(() => budgetStats.filter(b => b.isOver).length, [budgetStats]);
  const healthyCount = useMemo(() => budgetStats.filter(b => !b.isOver && b.percentage <= 80).length, [budgetStats]);
  const warningCount = useMemo(() => budgetStats.filter(b => !b.isOver && b.percentage > 80).length, [budgetStats]);
  const totalCategories = budgetStats.length;

  const canAddMore = useMemo(() => { const ec = categories?.expense || []; return ec.length > budgets.length; }, [budgets, categories]);
  const isOver = g.percentage > 100;
  const openAdd = () => { setEditData(null); setIsModalOpen(true); };
  const openEdit = (id, amt) => { setEditData({ category: id, limit: amt }); setIsModalOpen(true); };
  const close = () => { setIsModalOpen(false); setEditData(null); };

  return (
    <div className="pb-24 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-sm">
            <Wallet size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Budget</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalCategories} categor{totalCategories !== 1 ? 'ies' : 'y'}
              {overBudgetCount > 0 && ` · ${overBudgetCount} over budget`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-muted border border-border">
            {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="ghost" size="sm" onClick={() => { if (window.confirm('Reset all budget progress?')) resetBudget(); }} className="gap-1.5">
            <RefreshCw size={14} strokeWidth={1.5} /> Reset
          </Button>
        </div>
      </div>

      {/* Overview Summary */}
      {totalCategories > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-income/15 flex items-center justify-center">
                <TrendingUp size={14} className="text-income" />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Spent</span>
            </div>
            <p className={`text-lg font-bold font-mono tabular-nums ${isOver ? 'text-destructive' : 'text-foreground'}`}>{formatCurrency(g.totalSpent)}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-income/15 flex items-center justify-center">
                <PiggyBank size={14} className="text-income" />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Remaining</span>
            </div>
            <p className={`text-lg font-bold font-mono tabular-nums ${g.totalRemaining < 0 ? 'text-destructive' : 'text-income'}`}>{formatCurrency(g.totalRemaining)}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Gauge size={14} className="text-primary" />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Usage</span>
            </div>
            <p className={`text-lg font-bold font-mono tabular-nums ${isOver ? 'text-destructive' : 'text-foreground'}`}>{g.percentage.toFixed(0)}%</p>
          </Card>
        </div>
      )}

      {/* Main Overview */}
      <Card className={`p-6 relative overflow-hidden ${isOver ? 'border-destructive/30' : ''}`}>
        {isOver && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold border border-destructive/20">
            <AlertTriangle size={12} />
            Over Budget
          </div>
        )}
        <div className="flex items-center gap-2 mb-1">
          <Wallet size={14} className="text-primary" />
          <h2 className="text-xs font-medium text-muted-foreground">Monthly Budget</h2>
        </div>
        <p className="text-3xl font-bold text-foreground font-mono tabular-nums mt-1">{formatCurrency(g.totalLimit)}</p>

        <div className="my-5 rounded-xl border border-border bg-background/80">
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="p-4">
              <p className="text-xs text-muted-foreground">Spent</p>
              <p className="text-lg font-bold font-mono tabular-nums text-expense mt-0.5">{formatCurrency(g.totalSpent)}</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className={`text-lg font-bold font-mono tabular-nums mt-0.5 ${g.totalRemaining < 0 ? 'text-destructive' : 'text-income'}`}>{formatCurrency(g.totalRemaining)}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span className={`font-bold tabular-nums ${isOver ? 'text-destructive' : 'text-foreground'}`}>{g.percentage.toFixed(0)}%</span>
          </div>
          <BudgetProgressBar pct={g.percentage} isOver={isOver} size="lg" />
        </div>

        {/* Status pills */}
        {totalCategories > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
            {healthyCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {healthyCount} on track
              </span>
            )}
            {warningCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-800 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {warningCount} nearing limit
              </span>
            )}
            {overBudgetCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                {overBudgetCount} over budget
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Per Category */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center">
            <Sparkles size={12} className="text-muted-foreground" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Per Category</h2>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{totalCategories}</span>
        </div>
        {canAddMore && (
          <Button onClick={openAdd} className="gap-1 shadow-sm">
            <Plus size={14} /> Add Budget
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {budgetStats.map((item, idx) => (
          <Card
            key={item._id || item.id}
            className={`p-5 hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              item.isOver ? 'border-destructive/30' : ''
            }`}
            style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'backwards' }}
          >
            <div className={`-mx-5 -mt-5 mb-4 rounded-t-xl h-1 ${
              item.isOver
                ? 'bg-gradient-to-r from-destructive via-red-500 to-destructive'
                : item.percentage > 80
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400'
                  : 'bg-gradient-to-r from-primary/60 via-primary to-primary/60'
            }`} />

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.isOver
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-primary/10 text-primary'
                }`}>
                  <TrendingDown size={18} strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground capitalize truncate">{item.category?.name || 'Unknown'}</h3>
                    {item.isOver && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-bold border border-destructive/20 shrink-0">Over</span>
                    )}
                    {!item.isOver && item.percentage > 80 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold border border-amber-200 dark:border-amber-800 shrink-0">Warning</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Spent: <span className={item.isOver ? 'text-destructive font-semibold' : 'text-foreground font-semibold'}>{formatCurrency(item.spent)}</span>
                  </p>
                </div>
              </div>
              <div className="text-right flex items-start gap-2 shrink-0">
                <div>
                  <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => openEdit(item.categoryId, item.limitAmount)}>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Target:</span>
                    <span className="text-sm font-bold text-foreground font-mono tabular-nums group-hover:text-primary transition-colors">{formatCurrency(item.limitAmount)}</span>
                    <PencilLine size={12} strokeWidth={1.5} className="text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                  </div>
                  <p className={`text-[11px] mt-0.5 ${item.remaining < 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                    {item.remaining < 0
                      ? `Over by ${formatCurrency(Math.abs(item.remaining))}`
                      : `${formatCurrency(item.remaining)} left`
                    }
                  </p>
                </div>
                <button
                  onClick={() => deleteBudget(item.id || item.categoryId)}
                  className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                  aria-label="Hapus budget"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <BudgetProgressBar pct={item.percentage} isOver={item.isOver} />
              </div>
              <span className={`text-[11px] font-bold tabular-nums shrink-0 ${
                item.isOver ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {item.percentage.toFixed(0)}%
              </span>
            </div>
          </Card>
        ))}
      </div>

      {budgetStats.length === 0 && (
        <Card className="p-12 sm:p-16 text-center border-dashed border-2">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Wallet size={28} strokeWidth={1.5} className="text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No budget targets</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
            Set spending limits per category to track where your money goes each month.
          </p>
          <Button onClick={openAdd} className="gap-1.5 shadow-sm">
            <Plus size={16} /> Create Your First Budget
          </Button>
        </Card>
      )}

      <AddBudgetModal isOpen={isModalOpen} onClose={close} editData={editData} />
    </div>
  );
}
