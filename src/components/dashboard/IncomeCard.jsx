import { ArrowUp } from 'lucide-react';
import { formatCurrency } from '@/utils/utils';
import { useTransactions } from '@/context/TransactionContext';

function Skeleton() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between mb-3">
        <div className="h-4 w-28 bg-muted rounded animate-pulse" />
        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
      </div>
      <div className="flex items-end justify-between mb-5">
        <div className="h-9 w-36 bg-muted rounded animate-pulse" />
        <div className="h-9 w-28 bg-muted rounded-xl animate-pulse" />
      </div>
      <div className="flex gap-3">
        <div className="h-8 w-28 bg-muted rounded-full animate-pulse" />
        <div className="h-8 w-36 bg-muted rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export default function IncomeCard({ currentDate }) {
  const { transactions, loading } = useTransactions();
  if (loading || !transactions) return <Skeleton />;

  const incomeStats = (() => {
    const m=currentDate.getMonth(),y=currentDate.getFullYear(),lm=m===0?11:m-1,ly=m===0?y-1:y;
    const cur=transactions.filter(t=>{const d=new Date(t.date);return t.type==='income'&&d.getMonth()===m&&d.getFullYear()===y;}).reduce((a,c)=>a+c.amount,0);
    const prev=transactions.filter(t=>{const d=new Date(t.date);return t.type==='income'&&d.getMonth()===lm&&d.getFullYear()===ly;}).reduce((a,c)=>a+c.amount,0);
    return{currentMonthIncome:cur,percentage:prev===0?(cur>0?100:0):((cur-prev)/prev)*100,prevMonthIncome:prev};
  })();

  const bars = (() => {
    const r=[]; for(let i=6;i>=0;i--){const d=new Date(currentDate);d.setDate(d.getDate()-i);r.push(transactions.filter(t=>t.type==='income'&&new Date(t.date).toDateString()===d.toDateString()).reduce((a,c)=>a+c.amount,0));}
    const m=Math.max(...r,1); return r.map(v=>(v/m)*100);
  })();

  const monthLabel = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const diff = incomeStats.currentMonthIncome - incomeStats.prevMonthIncome;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">Pemasukan Saya</span>
        <span className="text-xs text-muted-foreground/60">{monthLabel}</span>
      </div>

      <div className="flex items-end justify-between mb-5">
        <h2 className="text-[32px] font-semibold text-foreground tracking-tight leading-none">
          <span className="font-mono">{formatCurrency(incomeStats.currentMonthIncome)}</span>
        </h2>

        <div className="flex items-end gap-[3px] bg-muted/50 px-3 py-2 rounded-xl h-9">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-[5px] rounded-t-sm bg-primary/70"
              style={{ height: `${Math.max(h, 8)}%` }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 flex-wrap">
        <div className="inline-flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground">
          <ArrowUp size={12} strokeWidth={2} className="text-primary" />
          Naik <span className="font-semibold text-primary">{incomeStats.percentage.toFixed(0)}%</span>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground">
          <ArrowUp size={12} strokeWidth={2} className="text-primary" />
          Diperoleh <span className="font-semibold text-primary">+{formatCurrency(Math.abs(diff))}</span>
        </div>
      </div>
    </div>
  );
}
