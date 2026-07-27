import { useMemo } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from 'recharts';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

function Skeleton() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-36 bg-muted rounded animate-pulse" />
        <div className="h-3 w-14 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-[200px] flex items-end gap-2 px-2">
        {[1,2,3,4,5,6,7].map(i => (
          <div key={i} className="flex-1 bg-muted/50 rounded-t-sm animate-pulse" style={{height: `${15 + i*10}%`}} />
        ))}
      </div>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-3.5 py-2.5 shadow-lg backdrop-blur-md">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-bold text-foreground font-mono">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function SpendingChart() {
  const { transactions, loading } = useTransactions();
  if (loading || !transactions) return <Skeleton />;

  const data = useMemo(() => {
    const r = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const s = d.toISOString().split('T')[0];
      r.push({
        date: s,
        dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        amount: transactions.filter(t => t.type === 'expense' && t.date === s).reduce((a, c) => a + Number(c.amount), 0),
      });
    }
    return r;
  }, [transactions]);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} strokeWidth={1.5} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Spending - 7 days</h3>
        </div>
        <Link
          to="/stats"
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-lg hover:bg-muted"
        >
          Details &rarr;
        </Link>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="var(--color-border)" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="dayName"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
              dy={8}
              interval="preserveStartEnd"
            />
            <YAxis hide domain={[0, 'dataMax + dataMax * 0.15']} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#spendGradient)"
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: 'var(--color-background)',
                fill: 'var(--color-primary)',
              }}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
