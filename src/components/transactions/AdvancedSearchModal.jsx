import { useState, useEffect } from 'react';
import { Filter, Check } from 'lucide-react';
import { useTransactions } from '@/context/TransactionContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AdvancedSearchModal({ isOpen, onClose }) {
  const { categories, advancedFilters, setAdvancedFilters, wallets } = useTransactions();
  const [localFilters, setLocalFilters] = useState(advancedFilters);
  const [activeTab, setActiveTab] = useState('filter');
  useEffect(() => { if (isOpen) setLocalFilters(advancedFilters); }, [isOpen, advancedFilters]);

  const apply = () => { setAdvancedFilters({ ...localFilters, isActive: true }); onClose(); };
  const reset = () => { const rs = { isActive: false, startDate: '', endDate: '', minAmount: '', maxAmount: '', categories: [], wallets: [], sortBy: 'newest' }; setLocalFilters(rs); setAdvancedFilters(rs); onClose(); };
  const tc = (id) => setLocalFilters(p => ({ ...p, categories: p.categories.includes(id) ? p.categories.filter(x => x !== id) : [...p.categories, id] }));
  const tw = (id) => setLocalFilters(p => ({ ...p, wallets: p.wallets.includes(id) ? p.wallets.filter(x => x !== id) : [...p.wallets, id] }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter size={16} strokeWidth={1.5} />Filter & Search
          </DialogTitle>
        </DialogHeader>

        <div className="flex border-b border-border">
          {['filter','sort'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors text-center ${activeTab === t ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {t === 'filter' ? 'Filter' : 'Sort'}
            </button>
          ))}
        </div>

        <div className="space-y-6 pt-4">
          {activeTab === 'filter' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-muted-foreground mb-1 block">From</label><input type="date" value={localFilters.startDate} onChange={e => setLocalFilters({...localFilters,startDate:e.target.value})} className="w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" /></div>
                  <div><label className="text-xs text-muted-foreground mb-1 block">To</label><input type="date" value={localFilters.endDate} onChange={e => setLocalFilters({...localFilters,endDate:e.target.value})} className="w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" /></div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Amount</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" inputMode="numeric" placeholder="Min" value={localFilters.minAmount ? Number(localFilters.minAmount).toLocaleString('id-ID') : localFilters.minAmount} onChange={e => { const v=e.target.value.replace(/\D/g,''); setLocalFilters({...localFilters,minAmount:v}); }} className="w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input type="text" inputMode="numeric" placeholder="Max" value={localFilters.maxAmount ? Number(localFilters.maxAmount).toLocaleString('id-ID') : localFilters.maxAmount} onChange={e => { const v=e.target.value.replace(/\D/g,''); setLocalFilters({...localFilters,maxAmount:v}); }} className="w-full bg-background border border-input rounded-lg p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Categories</label>
                <div className="flex flex-wrap gap-1">
                  {[...categories.expense, ...categories.income].map(cat => (
                    <button key={cat._id} onClick={() => tc(cat._id)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${localFilters.categories.includes(cat._id) ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background text-muted-foreground hover:text-foreground'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Wallets</label>
                <div className="flex flex-wrap gap-1">
                  {wallets.map(w => (
                    <button key={w._id} onClick={() => tw(w._id)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${localFilters.wallets.includes(w._id) ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background text-muted-foreground hover:text-foreground'}`}>
                      {w.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              {[{id:'newest',label:'Newest'},{id:'oldest',label:'Oldest'},{id:'highest',label:'Highest'},{id:'lowest',label:'Lowest'}].map(opt => (
                <button key={opt.id} onClick={() => setLocalFilters({...localFilters,sortBy:opt.id})}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${localFilters.sortBy === opt.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                  <span className="text-sm font-medium">{opt.label}</span>
                  {localFilters.sortBy === opt.id && <Check size={16} strokeWidth={3} className="text-primary-foreground" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border pt-4 flex items-center gap-3 mt-4">
          <Button variant="outline" onClick={reset} className="flex-1">Reset</Button>
          <Button onClick={apply} className="flex-1">Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
