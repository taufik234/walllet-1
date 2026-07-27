import { useState, useEffect } from 'react';
import { Target, TrendingUp, Sparkles } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { useConvex } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ICON_OPTIONS = [
  { value: 'Target', label: 'Target', svg: <Target size={20} strokeWidth={1.5} /> },
  { value: 'TrendingUp', label: 'Trend', svg: <TrendingUp size={20} strokeWidth={1.5} /> },
  { value: 'Sparkles', label: 'Sparkle', svg: <Sparkles size={20} strokeWidth={1.5} /> },
];

export default function AddGoalModal({ isOpen, onClose, editingGoal }) {
  const convex = useConvex();
  const { refetch } = useTransactions();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', targetAmount: '', deadline: '', icon: 'Target' });

  useEffect(() => {
    if (editingGoal) setFormData({ name: editingGoal.name || '', targetAmount: editingGoal.targetAmount || '', deadline: editingGoal.deadline || '', icon: editingGoal.icon || 'Target' });
    else setFormData({ name: '', targetAmount: '', deadline: '', icon: 'Target' });
  }, [editingGoal, isOpen]);

  const sub = async (e) => { e.preventDefault(); if (!formData.name || !formData.targetAmount) return; setLoading(true); try { const d = { name: formData.name, targetAmount: parseFloat(formData.targetAmount), deadline: formData.deadline || null, icon: formData.icon }; if (editingGoal) await convex.mutation(api.goals.update, { token: localStorage.getItem('auth_token'), id: editingGoal._id, ...d }); else await convex.mutation(api.goals.create, { token: localStorage.getItem('auth_token'), ...d }); refetch(); onClose(); } catch (e) { console.error(e); alert('Failed'); } finally { setLoading(false); } };
  const fmt = (n) => n ? new Intl.NumberFormat('id-ID').format(n) : '';
  const ha = (e) => { const v = e.target.value.replace(/\./g,'').replace(/,/g,''); if (!isNaN(v)) setFormData({...formData, targetAmount: v}); };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingGoal ? 'Edit Goal' : 'New Goal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={sub} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Goal Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})}
              className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Target Amount</label>
            <input type="text" inputMode="numeric" value={fmt(formData.targetAmount)} onChange={ha} placeholder="0"
              className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Target Date <span className="text-muted-foreground/60">(optional)</span></label>
            <input type="date" value={formData.deadline} onChange={e => setFormData({...formData,deadline:e.target.value})}
              className="w-full bg-background border border-input rounded-lg py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Icon</label>
            <div className="flex gap-3">
              {ICON_OPTIONS.map(opt => (
                <button key={opt.value} type="button" onClick={() => setFormData({...formData,icon:opt.value})}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    formData.icon === opt.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:text-foreground'
                  }`}>
                  {opt.svg}
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={loading || !formData.name || !formData.targetAmount} className="w-full">
            {loading ? 'Saving…' : (editingGoal ? 'Save Changes' : 'Create Goal')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
