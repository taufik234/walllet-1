import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AddBudgetModal({ isOpen, onClose, editData = null }) {
  const { updateBudget, budgets, categories } = useTransactions();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (isOpen) { if (editData) { setCategory(editData.category); setAmount(new Intl.NumberFormat('id-ID').format(editData.limit)); } else { setAmount(''); setCategory(''); } }
  }, [isOpen, editData]);

  const avail = (categories?.expense || []).filter(c => !budgets.some(b => b.categoryId === c.id) || (editData && c.id === editData.category));
  const ha = (e) => { const v = e.target.value.replace(/\D/g,''); setAmount(v ? new Intl.NumberFormat('id-ID').format(v) : ''); };
  const sub = (e) => { e.preventDefault(); const n = Number(amount.replace(/\./g,'')); if (!n || !category) return; updateBudget(category, n); onClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Budget' : 'Add Budget'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={sub} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Budget Target (IDR)</label>
            <input type="text" inputMode="numeric" value={amount} onChange={ha} placeholder="0" autoFocus
              className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
            <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto">
              {avail.length > 0 ? avail.map(cat => (
                <button key={cat.id} type="button" onClick={() => !editData && setCategory(cat.id)} disabled={!!editData}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-colors ${
                    category === cat.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'
                  } ${editData && category !== cat.id ? 'opacity-40 cursor-not-allowed' : ''}`}>
                  {cat.name}
                </button>
              )) : <div className="col-span-4 text-center py-4 text-sm text-muted-foreground">All categories have budgets</div>}
            </div>
            {editData && <p className="text-xs text-muted-foreground italic text-center mt-2">Category can't be changed during edit.</p>}
          </div>
          <Button type="submit" disabled={!amount || !category} className="w-full gap-2">
            <Check size={16} />Save Budget
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
