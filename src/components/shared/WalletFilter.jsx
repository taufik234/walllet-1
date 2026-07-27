import { useTransactions } from '@/context/TransactionContext';

export default function WalletFilter({ value, onChange }) {
  const { wallets } = useTransactions();
  const options = [{ id: 'all', label: 'All' }, ...wallets.map(w => ({ id: w._id, label: w.name }))];

  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => (
        <button key={opt.id} onClick={() => onChange(opt.id)}
          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
            value === opt.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
