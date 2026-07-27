import { useState, useMemo } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import AddGoalModal from '@/components/shared/AddGoalModal';
import AddSavingsModal from '@/components/goals/AddSavingsModal';
import {
  Plus, Target, CheckCircle, Trash2, PencilLine, PiggyBank,
  Calendar, TrendingUp, Trophy, Sparkles, Clock, Rocket,
  Flame, Gift
} from 'lucide-react';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function ProgressBar({ pct, done }) {
  const barColor = done
    ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400'
    : pct >= 75
      ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400'
      : pct >= 50
        ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400'
        : pct >= 25
          ? 'bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400'
          : 'bg-gradient-to-r from-rose-400 via-red-500 to-rose-400';

  return (
    <div className="h-3 bg-muted rounded-full overflow-hidden relative">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
        style={{ width: `${pct}%` }}
      />
      {/* Milestone dots */}
      {[25, 50, 75].map(m => (
        <div
          key={m}
          className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
            pct >= m ? 'bg-white/60' : 'bg-muted-foreground/20'
          }`}
          style={{ left: `calc(${m}% - 3px)` }}
        />
      ))}
    </div>
  );
}

function UrgencyBadge({ deadline }) {
  if (!deadline) return null;
  const now = new Date();
  const target = new Date(deadline);
  const daysLeft = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return null; // expired, handled elsewhere

  let color, icon, text;
  if (daysLeft <= 7) {
    color = 'bg-rose-500/15 text-rose-600 border-rose-200 dark:border-rose-800';
    icon = <Flame size={12} className="shrink-0" />;
    text = `${daysLeft}d left`;
  } else if (daysLeft <= 30) {
    color = 'bg-amber-500/15 text-amber-600 border-amber-200 dark:border-amber-800';
    icon = <Clock size={12} className="shrink-0" />;
    text = `${daysLeft}d left`;
  } else {
    color = 'bg-emerald-500/15 text-emerald-600 border-emerald-200 dark:border-emerald-800';
    icon = <Calendar size={12} className="shrink-0" />;
    text = `${daysLeft}d left`;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${color}`}>
      {icon}{text}
    </span>
  );
}

function getMilestone(pct) {
  if (pct >= 100) return { icon: Trophy, label: 'Complete!', color: 'text-emerald-500' };
  if (pct >= 75) return { icon: Rocket, label: 'Almost there', color: 'text-emerald-500' };
  if (pct >= 50) return { icon: Sparkles, label: 'Halfway!', color: 'text-amber-500' };
  if (pct >= 25) return { icon: TrendingUp, label: 'On track', color: 'text-orange-500' };
  return { icon: PiggyBank, label: 'Just started', color: 'text-muted-foreground' };
}

export default function Goals() {
  const convex = useConvex();
  const { goals, refetch } = useTransactions();
  const [activeTab, setActiveTab] = useState('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);

  const completed = useMemo(() => goals.filter(g => g.status === 'completed'), [goals]);
  const active = useMemo(() => goals.filter(g => g.status === 'active'), [goals]);
  const fg = activeTab === 'active' ? active : completed;

  const totalSaved = useMemo(() => active.reduce((s, g) => s + (g.currentAmount || 0), 0), [active]);
  const totalTarget = useMemo(() => active.reduce((s, g) => s + (g.targetAmount || 0), 0), [active]);
  const overallPct = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  const ha = (g) => { setSelectedGoal(g); setIsSavingsModalOpen(true); };
  const he = (g) => { setEditingGoal(g); setIsAddModalOpen(true); };
  const hd = async (id) => {
    if (window.confirm('Hapus goal ini?')) {
      try { await convex.mutation(api.goals.remove, { token: localStorage.getItem('auth_token'), id }); refetch(); }
      catch (e) { console.error(e); }
    }
  };

  return (
    <div className="pb-24 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-sm">
            <Target size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Goals</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {active.length} active goal{active.length !== 1 ? 's' : ''}
              {completed.length > 0 && ` · ${completed.length} completed`}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-1.5 shadow-sm">
          <Plus size={16} /> New Goal
        </Button>
      </div>

      {/* Overall Progress */}
      {active.length > 0 && (
        <div className="bg-gradient-to-br from-primary/5 via-primary/[0.02] to-background border border-primary/10 rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <TrendingUp size={14} className="text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground">Overall Progress</span>
            </div>
            <span className="text-xs font-bold text-foreground font-mono">{overallPct.toFixed(0)}%</span>
          </div>
          <ProgressBar pct={overallPct} done={false} />
          <div className="flex justify-between mt-2 text-[11px] text-muted-foreground">
            <span>Saved: <span className="font-semibold text-foreground">{formatCurrency(totalSaved)}</span></span>
            <span>Target: <span className="font-semibold text-foreground">{formatCurrency(totalTarget)}</span></span>
          </div>
        </div>
      )}

      {/* Tab + sort */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-xl border border-border bg-background overflow-hidden w-fit p-0.5 shadow-sm">
          {['active', 'completed'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                activeTab === t
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'active' ? `Active (${active.length})` : `Completed (${completed.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      {fg.length === 0 ? (
        <Card className="p-12 sm:p-16 text-center border-dashed border-2">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            {activeTab === 'active'
              ? <Gift size={28} strokeWidth={1.5} className="text-primary" />
              : <Trophy size={28} strokeWidth={1.5} className="text-muted-foreground" />
            }
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            {activeTab === 'active' ? 'No goals yet' : 'No completed goals'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
            {activeTab === 'active'
              ? 'Set your first savings target and start building toward something meaningful.'
              : 'Complete a goal and it will shine here.'
            }
          </p>
          {activeTab === 'active' && (
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-1.5 shadow-sm">
              <Plus size={16} /> Create Your First Goal
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fg.map((goal, idx) => {
            const pct = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
            const rem = goal.targetAmount - goal.currentAmount;
            const done = goal.status === 'completed';
            const milestone = getMilestone(pct);
            const MilestoneIcon = milestone.icon;

            return (
              <Card
                key={goal._id}
                className="group p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'backwards' }}
              >
                {/* Card accent stripe */}
                <div className={`h-1 -mx-5 -mt-5 mb-4 rounded-t-xl ${
                  done
                    ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400'
                    : pct >= 75
                      ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400'
                      : pct >= 50
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400'
                        : pct >= 25
                          ? 'bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400'
                          : 'bg-gradient-to-r from-rose-400 via-red-500 to-rose-400'
                }`} />

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      done
                        ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-500'
                        : 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary'
                    }`}>
                      {done
                        ? <CheckCircle size={20} strokeWidth={1.5} className="animate-in zoom-in duration-300" />
                        : <PiggyBank size={20} strokeWidth={1.5} />
                      }
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate">{goal.name}</h3>
                      {goal.deadline && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Calendar size={10} className="text-muted-foreground shrink-0" />
                          <p className="text-[10px] text-muted-foreground truncate">
                            {new Date(goal.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {done ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold shrink-0">
                      <CheckCircle size={10} /> Done
                    </span>
                  ) : (
                    <UrgencyBadge deadline={goal.deadline} />
                  )}
                </div>

                {/* Milestone status */}
                <div className="flex items-center gap-1.5 mb-3">
                  <MilestoneIcon size={12} className={milestone.color} />
                  <span className={`text-[10px] font-semibold ${milestone.color}`}>{milestone.label}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span className="font-bold tabular-nums text-foreground">{pct.toFixed(0)}%</span>
                  </div>
                  <ProgressBar pct={pct} done={done} />
                </div>

                {/* Amounts */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Saved</p>
                    <p className="text-base font-bold text-foreground font-mono tabular-nums">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Target</p>
                    <p className="text-base font-bold text-foreground font-mono tabular-nums">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>

                {/* Remaining */}
                {!done && rem > 0 && (
                  <div className="bg-gradient-to-r from-muted to-muted/50 rounded-xl p-3.5 mb-4 border border-border/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Remaining</p>
                        <p className="text-lg font-bold text-foreground font-mono tabular-nums">{formatCurrency(rem)}</p>
                      </div>
                      <Button size="xs" variant="secondary" onClick={() => ha(goal)} className="gap-1">
                        <Plus size={12} /> Add
                      </Button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className={`flex gap-2 ${done ? 'pt-2' : ''}`}>
                  {!done && (
                    <Button className="flex-1 gap-1.5 shadow-sm" onClick={() => ha(goal)}>
                      <Plus size={14} /> Add Savings
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={() => he(goal)}
                    className="hover:bg-muted transition-colors">
                    <PencilLine size={14} strokeWidth={1.5} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => hd(goal._id)}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 size={14} strokeWidth={1.5} />
                  </Button>
                </div>

                {/* Completed celebratory footer */}
                {done && (
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                    <Trophy size={12} />
                    Goal achieved
                    <Sparkles size={12} />
                  </div>
                )}
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
