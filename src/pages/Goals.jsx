import { useState, useMemo } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import AddGoalModal from '@/components/shared/AddGoalModal';
import AddSavingsModal from '@/components/goals/AddSavingsModal';
import { Plus, Target, CheckCircle, Trash2, PencilLine, PiggyBank } from 'lucide-react';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Goals() {
  const convex = useConvex();
  const { goals, refetch } = useTransactions();
  const [activeTab, setActiveTab] = useState('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);

  const fg = useMemo(() => goals.filter(g => g.status === (activeTab === 'active' ? 'active' : 'completed')), [goals, activeTab]);
  const ha = (g) => { setSelectedGoal(g); setIsSavingsModalOpen(true); };
  const he = (g) => { setEditingGoal(g); setIsAddModalOpen(true); };
  const hd = async (id) => { if (window.confirm('Hapus goal ini?')) { try { await convex.mutation(api.goals.remove, { token: localStorage.getItem('auth_token'), id }); refetch(); } catch (e) { console.error(e); } } };

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-primary" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">Goals</h1>
          </div>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-1.5">
          <Plus size={16} /> New Goal
        </Button>
      </div>

      {/* Tab */}
      <div className="flex gap-1 rounded-xl border border-border bg-background overflow-hidden w-fit p-0.5">
        {['active','completed'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              activeTab === t
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'active' ? 'Active' : 'Completed'}
          </button>
        ))}
      </div>

      <Separator className="opacity-50" />

      {/* Goals */}
      {fg.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
            <Target size={24} strokeWidth={1.5} className="text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            {activeTab === 'active' ? 'No active goals' : 'No completed goals'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {activeTab === 'active' ? 'Start setting your savings targets' : 'Completed goals show here'}
          </p>
          {activeTab === 'active' && <Button onClick={() => setIsAddModalOpen(true)}>Create first goal</Button>}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {fg.map(goal => {
            const pct = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
            const rem = goal.targetAmount - goal.currentAmount;
            const done = goal.status === 'completed';
            return (
              <Card key={goal._id} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      done ? 'bg-secondary text-secondary-foreground' : 'bg-primary/15 text-primary'
                    }`}>
                      {done ? <CheckCircle size={20} strokeWidth={1.5} /> : <PiggyBank size={20} strokeWidth={1.5} />}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{goal.name}</h3>
                      {goal.deadline && (
                        <p className="text-xs text-muted-foreground">
                          Target: {new Date(goal.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                  {done && <span className="tag">Done</span>}
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span className="font-semibold text-foreground">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 100 ? 'bg-primary' : pct >= 50 ? 'bg-primary' : 'bg-primary/60'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Saved</p>
                    <p className="text-base font-bold text-foreground font-mono">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="text-base font-bold text-foreground font-mono">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>

                {!done && rem > 0 && (
                  <div className="bg-muted/50 rounded-xl p-3 mb-4">
                    <p className="text-xs text-muted-foreground mb-0.5">Remaining</p>
                    <p className="text-lg font-bold text-foreground font-mono">{formatCurrency(rem)}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {!done && <Button className="flex-1" onClick={() => ha(goal)}>Add Savings</Button>}
                  <Button variant="outline" size="icon" onClick={() => he(goal)}>
                    <PencilLine size={14} strokeWidth={1.5} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => hd(goal._id)}>
                    <Trash2 size={14} strokeWidth={1.5} />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AddGoalModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setEditingGoal(null); }} editingGoal={editingGoal} />
      <AddSavingsModal isOpen={isSavingsModalOpen} onClose={() => { setIsSavingsModalOpen(false); setSelectedGoal(null); }} goal={selectedGoal} />
    </div>
  );
}
