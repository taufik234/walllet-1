import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/utils';
import { useTransactions } from '@/context/TransactionContext';
import { Card } from '@/components/ui/card';

function Skeleton() {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex justify-between mb-3">
        <div className="h-4 w-24 sm:w-28 bg-muted rounded animate-pulse" />
        <div className="h-3 w-16 sm:w-20 bg-muted rounded animate-pulse" />
      </div>
      <div className="flex items-end justify-between mb-5">
        <div className="h-7 sm:h-9 w-28 sm:w-36 bg-muted rounded animate-pulse" />
        <div className="h-7 sm:h-9 w-20 sm:w-28 bg-muted rounded-xl animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-24 sm:w-28 bg-muted rounded-full animate-pulse" />
        <div className="h-8 w-28 sm:w-36 bg-muted rounded-full animate-pulse" />
      </div>
    </Card>
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
  const pct = incomeStats.percentage;
  const isUp = pct >= 0;

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate mr-2">Pemasukan Saya</span>
        <span className="text-[10px] sm:text-xs text-muted-foreground/60 shrink-0">{monthLabel}</span>
      </div>

      <div className="flex items-end justify-between mb-4 sm:mb-5 gap-3">
        <h2 className="text-xl sm:text-[32px] font-semibold text-foreground tracking-tight leading-none">
          <span className="font-mono">{formatCurrency(incomeStats.currentMonthIncome)}</span>
        </h2>

        <div className="flex items-end gap-[3px] bg-muted/50 px-2 sm:px-3 py-2 rounded-xl h-7 sm:h-9 shrink-0" aria-label="Grafik 7 hari terakhir" role="img">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-[3px] sm:w-[5px] rounded-t-sm bg-primary/70 motion-safe:transition-all motion-safe:duration-300"
              style={{ height: `${Math.max(h, 8)}%` }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {incomeStats.currentMonthIncome > 0 || incomeStats.prevMonthIncome > 0 ? (
          <>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-muted/60 px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-muted-foreground">
              {isUp ? <ArrowUp size={10} strokeWidth={2} className="text-primary shrink-0" /> : <ArrowDown size={10} strokeWidth={2} className="text-destructive shrink-0" />}
              {isUp ? 'Naik' : 'Turun'} <span className={`font-semibold ${isUp ? 'text-primary' : 'text-destructive'}`}>{Math.abs(pct).toFixed(0)}%</span>
            </div>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-muted/60 px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-muted-foreground">
              <TrendingUp size={10} strokeWidth={2} className={`shrink-0 ${isUp ? 'text-primary' : 'text-destructive'}`} />
              {isUp ? 'Bertambah' : 'Berkurang'} <span className={`font-semibold ${isUp ? 'text-primary' : 'text-destructive'}`}>{formatCurrency(Math.abs(diff))}</span>
            </div>
          </>
        ) : (
          <div className="inline-flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground">
            Belum ada pemasukan bulan ini
          </div>
        )}
      </div>
    </Card>
  );
}
