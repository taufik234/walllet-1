import { useState, useMemo } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { Plus, PencilLine, Trash2, RefreshCw } from 'lucide-react';
import AddBudgetModal from '@/components/shared/AddBudgetModal';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Budget() {
  const { budgetStats, deleteBudget, budgets, categories, resetBudget } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const g = useMemo(() => {
    const tl = budgetStats.reduce((a, c) => a + Number(c.limitAmount || 0), 0);
    const ts = budgetStats.reduce((a, c) => a + Number(c.spent || 0), 0);
    return { totalLimit: tl, totalSpent: ts, totalRemaining: tl - ts, percentage: tl > 0 ? (ts / tl) * 100 : 0 };
  }, [budgetStats]);

  const canAddMore = useMemo(() => { const ec = categories?.expense || []; return ec.length > budgets.length; }, [budgets, categories]);
  const isOver = g.percentage > 100;
  const openAdd = () => { setEditData(null); setIsModalOpen(true); };
  const openEdit = (id, amt) => { setEditData({ category: id, limit: amt }); setIsModalOpen(true); };
  const close = () => { setIsModalOpen(false); setEditData(null); };

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-primary" />
          <h1 className="text-lg font-semibold text-foreground">Budget</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => { if (window.confirm('Reset progress?')) resetBudget(); }} className="gap-1.5">
            <RefreshCw size={14} strokeWidth={1.5} /> Reset
          </Button>
          <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-muted border border-border">
            {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Overview */}
      <Card className="p-6">
        <h2 className="text-xs font-medium text-muted-foreground mb-1">Monthly Budget</h2>
        <p className="text-3xl font-bold text-foreground font-mono">{formatCurrency(g.totalLimit)}</p>
        <div className="my-5 rounded-xl border border-border bg-background">
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="p-4">
              <p className="text-xs text-muted-foreground">Spent</p>
              <p className="text-lg font-bold font-mono text-expense">{formatCurrency(g.totalSpent)}</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className={`text-lg font-bold font-mono ${g.totalRemaining < 0 ? 'text-expense' : 'text-income'}`}>{formatCurrency(g.totalRemaining)}</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span className={`font-semibold ${isOver ? 'text-destructive' : 'text-foreground'}`}>{g.percentage.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-destructive' : 'bg-primary'}`}
              style={{ width: `${Math.min(g.percentage, 100)}%` }}
            />
          </div>
        </div>
      </Card>

      <Separator className="opacity-50" />

      {/* Per Category */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Per Category</h2>
        {canAddMore && (
          <Button variant="outline" size="sm" onClick={openAdd} className="gap-1">
            <Plus size={14} /> Add
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {budgetStats.map((item) => (
          <Card key={item._id || item.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground capitalize flex items-center gap-2">
                  {item.category?.name || 'Unknown'}
                  {item.isOver && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">Over</span>}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Spent: <span className={item.isOver ? 'text-destructive font-semibold' : 'text-foreground'}>{formatCurrency(item.spent)}</span>
                </p>
              </div>
              <div className="text-right flex items-start gap-3 shrink-0">
                <div>
                  <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => openEdit(item.categoryId, item.limitAmount)}>
                    <span className="text-xs text-muted-foreground">Target:</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary">{formatCurrency(item.limitAmount)}</span>
                    <PencilLine size={12} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground" />
                  </div>
                  <p className={`text-xs mt-0.5 ${item.remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {item.remaining < 0 ? `Over: ${formatCurrency(Math.abs(item.remaining))}` : `Left: ${formatCurrency(item.remaining)}`}
                  </p>
                </div>
                <button onClick={() => deleteBudget(item.id || item.categoryId)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.isOver ? 'bg-destructive' : item.percentage > 80 ? 'bg-primary' : 'bg-primary/60'}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      {budgetStats.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No budget targets</p>
          <Button variant="link" onClick={openAdd} className="mt-2">Set one now</Button>
        </Card>
      )}

      <AddBudgetModal isOpen={isModalOpen} onClose={close} editData={editData} />
    </div>
  );
}
