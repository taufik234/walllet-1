import { ArrowUp, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/utils/utils';
import { useTransactions } from '@/context/TransactionContext';
import { Card } from '@/components/ui/card';

function Skeleton() {
  return (
    <Card className="p-5">
      <div className="h-8 w-24 bg-muted rounded animate-pulse mb-4" />
      <div className="flex items-end justify-between">
        <div className="space-y-3">
          <div className="h-9 w-32 bg-muted rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-5 w-14 bg-muted rounded-full animate-pulse" />
            <div className="h-5 w-10 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex items-end gap-1 h-12">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className="w-1.5 rounded-sm bg-muted animate-pulse" style={{height:`${20+i*10}%`}} />)}
        </div>
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
    return{currentMonthIncome:cur,percentage:prev===0?(cur>0?100:0):((cur-prev)/prev)*100};
  })();

  const bars = (() => {
    const r=[]; for(let i=6;i>=0;i--){const d=new Date(currentDate);d.setDate(d.getDate()-i);r.push(transactions.filter(t=>t.type==='income'&&new Date(t.date).toDateString()===d.toDateString()).reduce((a,c)=>a+c.amount,0));}
    const m=Math.max(...r,1); return r.map(v=>(v/m)*100);
  })();

  const isPositive = incomeStats.percentage >= 0;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-income flex items-center justify-center">
          <ArrowUp size={14} strokeWidth={2} className="text-income" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">Monthly Income</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-foreground font-mono tracking-tight">{formatCurrency(incomeStats.currentMonthIncome)}</p>
          <div className="flex gap-2 mt-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isPositive ? 'bg-income/20 text-income' : 'bg-expense-bg text-expense'
            }`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? '+' : ''}{incomeStats.percentage.toFixed(0)}%
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">MTD</span>
          </div>
        </div>
        <div className="flex items-end gap-[3px] h-14">
          {bars.map((h,i) => (
            <div
              key={i}
              className={`w-[5px] rounded-t-sm transition-all duration-300 ${
                i === bars.length-1 ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/40'
              }`}
              style={{height:`${Math.max(h,6)}%`}}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
