import { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import AdjustBalanceModal from '@/components/dashboard/AdjustBalanceModal';
import { Plus, Wallet, Trash2, PencilLine, CreditCard, ArrowRight, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const walletAccents = [
  { bg: 'bg-gradient-to-br from-orange-500/20 to-orange-500/5', text: 'text-orange-500', dot: 'bg-orange-500' },
  { bg: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5', text: 'text-blue-500', dot: 'bg-blue-500' },
  { bg: 'bg-gradient-to-br from-purple-500/20 to-purple-500/5', text: 'text-purple-500', dot: 'bg-purple-500' },
  { bg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5', text: 'text-emerald-500', dot: 'bg-emerald-500' },
  { bg: 'bg-gradient-to-br from-rose-500/20 to-rose-500/5', text: 'text-rose-500', dot: 'bg-rose-500' },
];

export default function Wallets() {
  const { walletStats, transactions, wallets, createWallet, deleteWallet } = useTransactions();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState('');

  const totalBalance = wallets.reduce((s, w) => s + (walletStats[w._id] || 0), 0);

  const ha = (id) => { setSelectedWallet(id); setIsAdjustModalOpen(true); };
  const hAdd = async (e) => {
    e.preventDefault();
    if (!newName) { setWalletError('Nama dompet harus diisi'); return; }
    setWalletLoading(true);
    setWalletError('');
    try {
      await createWallet(newName, Number(newBalance.replace(/\./g,'')) || 0);
      setNewName(''); setNewBalance(''); setIsAddModalOpen(false);
    } catch (err) {
      setWalletError(err.message || 'Gagal membuat dompet');
    } finally {
      setWalletLoading(false);
    }
  };
  const hDelete = (id, name) => { if (window.confirm(`Hapus dompet "${name}"?`)) deleteWallet(id); };
  const haNum = (e) => { const v = e.target.value.replace(/\D/g,''); setNewBalance(v ? new Intl.NumberFormat('id-ID').format(v) : ''); };

  return (
    <div className="pb-24 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-sm">
            <CreditCard size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Wallets</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
              {totalBalance > 0 && ` · Total ${formatCurrency(totalBalance)}`}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-1.5 shadow-sm">
          <Plus size={14} /> Add Wallet
        </Button>
      </div>

      {/* Empty state */}
      {wallets.length === 0 && (
        <Card className="p-12 sm:p-16 text-center border-dashed border-2">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Wallet size={28} strokeWidth={1.5} className="text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No wallets yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
            Create your first wallet to start tracking your finances.
          </p>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-1.5 shadow-sm">
            <Plus size={16} /> Create Wallet
          </Button>
        </Card>
      )}

      {/* Wallet grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((w, idx) => {
          const b = walletStats[w._id] || 0;
          const rx = transactions.filter(t => t.walletId === w._id).slice(0, 3);
          const accent = walletAccents[idx % walletAccents.length];
          return (
            <Card
              key={w._id}
              className="flex flex-col overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'backwards' }}
            >
              {/* Accent stripe */}
              <div className={`h-1 ${accent.bg.replace('bg-gradient-to-br', 'bg-gradient-to-r').replace('/20', '/40').replace('/5', '/40')}`} />

              <div className="p-5 flex-1 relative">
                {/* Delete */}
                <button
                  onClick={() => hDelete(w._id, w.name)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                  aria-label={`Hapus ${w.name}`}
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl ${accent.bg} flex items-center justify-center`}>
                    <Wallet size={20} strokeWidth={1.5} className={accent.text} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">{w.name}</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Balance</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground font-mono tabular-nums mb-4">{formatCurrency(b)}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => ha(w._id)}
                >
                  <PencilLine size={12} strokeWidth={1.5} /> Adjust Balance
                </Button>

                {/* Presence indicator */}
                <div className="flex items-center gap-1.5 mt-4 text-[10px] text-muted-foreground">
                  <span className={`w-1.5 h-1.5 rounded-full ${rx.length > 0 ? accent.dot : 'bg-muted-foreground/30'}`} />
                  {rx.length > 0 ? 'Active' : 'No activity'}
                </div>
              </div>

              {/* Recent transactions footer */}
              <div className="border-t border-border bg-muted/30 px-5 py-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Recent</p>
                <div className="space-y-2">
                  {rx.length > 0 ? rx.map(t => (
                    <div key={t._id} className="flex justify-between items-center group/recent">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0">{t.type === 'income' ? <TrendingUp size={10} className="text-income" /> : <TrendingDown size={10} className="text-expense" />}</span>
                        <span className="text-xs text-foreground truncate">{t.note || t.category?.name || 'Others'}</span>
                      </div>
                      <span className={`text-xs font-semibold font-mono tabular-nums shrink-0 ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </div>
                  )) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Wallet size={10} />
                      <span>No transactions yet</span>
                    </div>
                  )}
                  {rx.length > 0 && (
                    <Link to="/transactions" className="flex items-center justify-center gap-1 mt-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors pt-1 border-t border-border/50">
                      See all <ArrowRight size={10} />
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
      <Dialog open={isAddModalOpen} onOpenChange={(open) => { if (!open) { setIsAddModalOpen(false); setWalletError(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Dompet Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={hAdd} className="space-y-4">
            <div>
              <label htmlFor="w-name" className="block text-xs font-medium text-muted-foreground mb-1.5">Nama Dompet</label>
              <input
                id="w-name"
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Bank Mandiri"
                autoFocus
                required
                className="w-full bg-background border border-input rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="w-balance" className="block text-xs font-medium text-muted-foreground mb-1.5">Saldo Awal <span className="text-muted-foreground/60">(opsional)</span></label>
              <input
                id="w-balance"
                type="text"
                inputMode="numeric"
                value={newBalance}
                onChange={haNum}
                placeholder="0"
                className="w-full bg-background border border-input rounded-xl py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {walletError && (
              <div role="alert" className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{walletError}</span>
              </div>
            )}

            <Button type="submit" disabled={walletLoading || !newName} className="w-full gap-2">
              {walletLoading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Menyimpan...</>
              ) : (
                <><Plus size={16} /> Buat Dompet</>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
