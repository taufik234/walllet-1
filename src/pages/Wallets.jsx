import { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import AdjustBalanceModal from '@/components/dashboard/AdjustBalanceModal';
import { Plus, Wallet, Trash2, PencilLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const walletAccents = [
  { bg: 'bg-orange-500/15', text: 'text-orange-500' },
  { bg: 'bg-blue-500/15', text: 'text-blue-500' },
  { bg: 'bg-purple-500/15', text: 'text-purple-500' },
  { bg: 'bg-emerald-500/15', text: 'text-emerald-500' },
  { bg: 'bg-rose-500/15', text: 'text-rose-500' },
];

export default function Wallets() {
  const { walletStats, transactions, wallets, createWallet, deleteWallet } = useTransactions();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');

  const ha = (id) => { setSelectedWallet(id); setIsAdjustModalOpen(true); };
  const hAdd = async (e) => {
    e.preventDefault(); if (!newName) return;
    try { await createWallet(newName, Number(newBalance.replace(/\./g,'')) || 0); setNewName(''); setNewBalance(''); setIsAddModalOpen(false); } catch {}
  };
  const hDelete = (id, name) => { if (window.confirm(`Delete wallet "${name}"?`)) deleteWallet(id); };
  const fmt = (n) => n ? new Intl.NumberFormat('id-ID').format(n) : '';
  const haNum = (e) => { const v = e.target.value.replace(/\D/g,''); setNewBalance(v ? new Intl.NumberFormat('id-ID').format(v) : ''); };

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 rounded-full bg-primary" />
          <h1 className="text-lg font-semibold text-foreground">Wallets</h1>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-1.5">
          <Plus size={14} /> Add Wallet
        </Button>
      </div>

      <Separator className="opacity-50" />

      {/* Empty state */}
      {wallets.length === 0 && (
        <Card className="p-10 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
            <Wallet size={24} strokeWidth={1.5} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No wallets yet</p>
          <Button variant="link" onClick={() => setIsAddModalOpen(true)} className="mt-2">Create one</Button>
        </Card>
      )}

      {/* Wallet grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {wallets.map((w, idx) => {
          const b = walletStats[w._id] || 0;
          const rx = transactions.filter(t => t.walletId === w._id).slice(0, 3);
          const accent = walletAccents[idx % walletAccents.length];
          return (
            <Card key={w._id} className="flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${accent.bg} flex items-center justify-center`}>
                      <Wallet size={20} strokeWidth={1.5} className={accent.text} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">{w.name}</h2>
                      <p className="text-xs text-muted-foreground">Balance</p>
                    </div>
                  </div>
                  <button onClick={() => hDelete(w._id, w.name)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
                <p className="text-2xl font-bold text-foreground font-mono mb-4">{formatCurrency(b)}</p>
                <Button variant="link" className="p-0 h-auto gap-1 text-sm" onClick={() => ha(w._id)}>
                  <PencilLine size={12} strokeWidth={1.5} /> Adjust Balance
                </Button>
              </div>
              <div className="border-t border-border p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">Recent</p>
                <div className="space-y-2">
                  {rx.length > 0 ? rx.map(t => (
                    <div key={t._id} className="flex justify-between items-center">
                      <span className="text-sm text-foreground truncate max-w-[60%]">{t.note || t.category?.name}</span>
                      <span className={`text-sm font-semibold font-mono ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">No transactions</p>}
                  {rx.length > 0 && (
                    <Link to="/transactions" className="block mt-3 text-center text-xs text-muted-foreground hover:text-foreground">
                      See all &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <AdjustBalanceModal
        isOpen={isAdjustModalOpen}
        onClose={() => { setIsAdjustModalOpen(false); setSelectedWallet(null); }}
        walletId={selectedWallet}
        currentBalance={selectedWallet ? walletStats[selectedWallet] : 0}
      />

      {/* Add wallet dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Wallet</DialogTitle>
          </DialogHeader>
          <form onSubmit={hAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Name</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Bank Mandiri"
                autoFocus
                required
                className="w-full bg-background border border-input rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Initial Balance (optional)</label>
              <input
                type="text"
                inputMode="numeric"
                value={newBalance}
                onChange={haNum}
                placeholder="0"
                className="w-full bg-background border border-input rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
            <Button type="submit" disabled={!newName} className="w-full">
              Create Wallet
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
