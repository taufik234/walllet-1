export default function TypeFilter({ value, onChange }) {
  const options = [
    { id: 'all', label: 'All' },
    { id: 'income', label: 'Income' },
    { id: 'expense', label: 'Expense' },
  ];
  return (
    <div className="flex rounded-lg border border-border bg-background overflow-hidden">
      {options.map((opt) => (
        <button key={opt.id} onClick={() => onChange(opt.id)}
          className={`px-3.5 py-2 text-sm font-medium transition-colors ${
            value === opt.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
