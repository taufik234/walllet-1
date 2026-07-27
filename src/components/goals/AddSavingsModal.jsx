import { useState } from 'react';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/utils/utils';
import { useTransactions } from '@/context/TransactionContext';
import { useConvex } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddSavingsModal({ isOpen, onClose, goal }) {
  const convex = useConvex();
  const { refetch } = useTransactions();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const remaining = goal ? (goal.targetAmount - goal.currentAmount) : 0;
  const ha = (e) => { const v = e.target.value.replace(/\D/g,''); setAmount(v ? new Intl.NumberFormat('id-ID').format(parseInt(v)) : ''); };
  const sub = async (e) => { e.preventDefault(); const n = parseInt(amount.replace(/\./g,'')); if (!n || !goal) return; setLoading(true); try { await convex.mutation(api.goals.addSavings, { token: localStorage.getItem('auth_token'), id: goal._id, amount: n }); refetch(); setAmount(''); onClose(); } catch (e) { console.error(e); alert('Failed'); } finally { setLoading(false); } };
  const q = [50000,100000,250000,500000];
  if (!isOpen || !goal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Savings</DialogTitle>
          <p className="text-xs text-muted-foreground">{goal.name}</p>
        </DialogHeader>
        <form onSubmit={sub} className="space-y-5">
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">Saved</span>
              <span className="text-sm font-semibold text-foreground">{formatCurrency(goal.currentAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Remaining</span>
              <span className="text-sm font-semibold text-foreground">{formatCurrency(remaining)}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Amount</label>
            <Input type="text" inputMode="numeric" value={amount} onChange={ha} placeholder="0" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Quick</label>
            <div className="grid grid-cols-4 gap-1">
              {q.map(qa => <button key={qa} type="button" onClick={() => setAmount(new Intl.NumberFormat('id-ID').format(qa))}
                className="rounded-lg border border-border bg-background py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">{(qa/1000)}K</button>)}
            </div>
            {remaining > 0 && <button type="button" onClick={() => setAmount(new Intl.NumberFormat('id-ID').format(remaining))}
              className="w-full mt-2 rounded-lg border border-primary/30 bg-background py-2 text-sm font-medium text-primary hover:bg-secondary transition-colors">Pay all ({formatCurrency(remaining)})</button>}
          </div>
          <Button type="submit" disabled={loading || !amount || parseInt(amount.replace(/\./g,'')) <= 0} className="w-full gap-2">
            <Plus size={16} />{loading ? 'Saving…' : 'Add Savings'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
