import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, CartesianGrid } from 'recharts';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { Download, FileText, TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const COLORS = ['var(--color-chart-1)','var(--color-chart-2)','var(--color-chart-3)','var(--color-chart-4)','var(--color-chart-5)','var(--color-chart-6)','var(--color-chart-7)'];

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex rounded-xl border border-border bg-background overflow-hidden p-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
            value === o.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl px-3.5 py-2.5 shadow-lg backdrop-blur-md">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold text-foreground font-mono" style={{ color: p.color }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-popover border border-border rounded-xl px-3.5 py-2.5 shadow-lg backdrop-blur-md">
      <p className="text-xs font-medium text-muted-foreground mb-1">{d.name}</p>
      <p className="text-sm font-bold text-foreground font-mono">{formatCurrency(d.value)}</p>
    </div>
  );
}

export default function Stats() {
  const { transactions, stats } = useTransactions();
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('expense');
  const now = new Date();

  const { currentRange, prevRange, label } = useMemo(() => {
    const s=new Date(now),e=new Date(now),ps=new Date(now),pe=new Date(now); let l='';
    if(timeRange==='week'){const d=s.getDay()||7;s.setHours(0,0,0,0);s.setDate(s.getDate()-d+1);e.setHours(23,59,59,999);ps.setDate(s.getDate()-7);pe.setDate(e.getDate()-7);l='This Week';}
    else if(timeRange==='month'){s.setDate(1);s.setHours(0,0,0,0);e.setHours(23,59,59,999);ps.setMonth(s.getMonth()-1);ps.setDate(1);pe.setMonth(e.getMonth()-1);pe.setDate(e.getDate());l='This Month';}
    else{s.setMonth(0,1);s.setHours(0,0,0,0);e.setHours(23,59,59,999);ps.setFullYear(s.getFullYear()-1);pe.setFullYear(e.getFullYear()-1);l='This Year';}
    return{currentRange:{start:s,end:e},prevRange:{start:ps,end:pe},label:l};
  }, [timeRange]);

  const ft = useMemo(()=>transactions.filter(t=>{const d=new Date(t.date);return d>=currentRange.start&&d<=currentRange.end&&t.type===reportType;}),[transactions,currentRange,reportType]);

  const totalAmount = useMemo(() => ft.reduce((a,t)=>a+Number(t.amount),0), [ft]);

  const trendData = useMemo(() => {
    const data=[]; const gdt=(d,tx)=>{const s=d.toISOString().split('T')[0];return tx.filter(t=>t.type===reportType&&t.date===s).reduce((a,c)=>a+Number(c.amount),0);};
    if(timeRange==='week'){const c=new Date(currentRange.start),p=new Date(prevRange.start);for(let i=0;i<7;i++){data.push({name:c.toLocaleDateString('id-ID',{weekday:'short'}),current:gdt(c,transactions),previous:gdt(p,transactions)});c.setDate(c.getDate()+1);p.setDate(p.getDate()+1);}}
    else if(timeRange==='month'){const dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate(),c=new Date(now.getFullYear(),now.getMonth(),1),p=currentRange.start.getMonth()===0?new Date(now.getFullYear()-1,11,1):new Date(now.getFullYear(),now.getMonth()-1,1);for(let i=1;i<=dim;i++){data.push({name:`${i}`,current:gdt(c,transactions),previous:gdt(p,transactions)});c.setDate(c.getDate()+1);p.setDate(p.getDate()+1);}}
    else{for(let i=0;i<12;i++){const ms=new Date(now.getFullYear(),i,1),pms=new Date(now.getFullYear()-1,i,1);const gmt=(m,y)=>transactions.filter(t=>{const d=new Date(t.date);return d.getMonth()===m.getMonth()&&d.getFullYear()===y&&t.type===reportType;}).reduce((a,c)=>a+Number(c.amount),0);data.push({name:ms.toLocaleDateString('id-ID',{month:'short'}),current:gmt(ms,now.getFullYear()),previous:gmt(pms,now.getFullYear()-1)});}}
    return data;
  }, [transactions,timeRange,currentRange,prevRange,reportType]);

  const catData = useMemo(()=>{const g={};ft.forEach(t=>{const n=t.category?.name||'Others';if(!g[n])g[n]=0;g[n]+=Number(t.amount);});return Object.entries(g).map(([n,v])=>({name:n,value:v})).sort((a,b)=>b.value-a.value);}, [ft]);

  const isExpense = reportType === 'expense';

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 rounded-full bg-primary" />
          <h1 className="text-lg font-semibold text-foreground">Reports</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <ToggleGroup
            options={[
              { value: 'expense', label: 'Expenses' },
              { value: 'income', label: 'Income' },
            ]}
            value={reportType}
            onChange={setReportType}
          />
          <ToggleGroup
            options={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
            ]}
            value={timeRange}
            onChange={setTimeRange}
          />
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs"><Download size={14} className="mr-1" />Excel</Button>
        <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs"><FileText size={14} className="mr-1" />PDF</Button>
      </div>

      <Separator className="my-1" />

      {/* KPI + Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {/* Total KPI */}
        <Card className="col-span-2 sm:col-span-1 md:col-span-1 p-5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-1.5 mb-2">
              {isExpense
                ? <TrendingDown size={14} strokeWidth={2} className="text-expense" />
                : <TrendingUp size={14} strokeWidth={2} className="text-income" />
              }
              <p className="text-xs font-medium text-muted-foreground">
                Total {isExpense ? 'Expense' : 'Income'}
              </p>
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">{formatCurrency(totalAmount)}</p>
            <p className="text-[10px] text-muted-foreground mt-2">{label}</p>
          </div>
        </Card>

        {/* Category cards */}
        {catData.length > 0 ? catData.slice(0, 6).map((c, i) => (
          <Card key={c.name} className="p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
              <p className="text-xs text-muted-foreground truncate">{c.name}</p>
            </div>
            <p className="text-base font-bold text-foreground font-mono">{formatCurrency(c.value)}</p>
            <div className="mt-2.5 w-full bg-muted h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((c.value / Math.max(...catData.map(x => x.value))) * 100, 100)}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </Card>
        )) : (
          <Card className="col-span-2 p-6 text-center">
            <BarChart3 size={28} strokeWidth={1} className="text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No data for this period</p>
          </Card>
        )}
      </div>

      <Separator className="my-1" />

      {/* Comparison Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} strokeWidth={1.5} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Trend Comparison</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-foreground" />
              Current
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              Previous
            </span>
          </div>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -4 }}>
              <defs>
                <linearGradient id="trendCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} opacity={0.4} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                dy={10}
                interval="preserveStartEnd"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area
                type="monotone"
                dataKey="previous"
                stroke="var(--color-muted-foreground)"
                strokeWidth={2}
                strokeDasharray="5 4"
                fillOpacity={0}
                fill="transparent"
                activeDot={false}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#trendCurrent)"
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

      <Separator className="my-1" />

      {/* Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={16} strokeWidth={1.5} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Distribution</h3>
          </div>
          {catData.length > 0 ? (
            <div className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {catData.map((e, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12 text-center">
              <PieChartIcon size={32} strokeWidth={1} className="text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No data</p>
            </div>
          )}
        </Card>

        {/* Category list */}
        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} strokeWidth={1.5} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">By Category</h3>
          </div>
          <div className="space-y-1.5">
            {catData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                  <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-muted-foreground font-mono">
                    {totalAmount > 0 ? ((item.value / totalAmount) * 100).toFixed(1) + '%' : '0%'}
                  </span>
                  <span className="text-sm font-semibold text-foreground font-mono min-w-[80px] text-right">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              </div>
            ))}
            {catData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No categories yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
