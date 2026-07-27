import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, CartesianGrid } from 'recharts';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/utils';
import { Download, FileText, TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, BarChart, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const COLORS = ['var(--color-chart-1)','var(--color-chart-2)','var(--color-chart-3)','var(--color-chart-4)','var(--color-chart-5)','var(--color-chart-6)','var(--color-chart-7)'];

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex rounded-xl border border-border bg-background overflow-hidden p-0.5 shadow-sm">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 sm:px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
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
  const { transactions } = useTransactions();
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('expense');
  const [showAllCats, setShowAllCats] = useState(false);
  const now = new Date();

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const { currentRange, prevRange, label } = useMemo(() => {
    const s=new Date(now),e=new Date(now),ps=new Date(now),pe=new Date(now); let l='';
    if(timeRange==='week'){const d=s.getDay()||7;s.setHours(0,0,0,0);s.setDate(s.getDate()-d+1);e.setHours(23,59,59,999);ps.setDate(s.getDate()-7);pe.setDate(e.getDate()-7);l='This Week';}
    else if(timeRange==='month'){s.setDate(1);s.setHours(0,0,0,0);e.setHours(23,59,59,999);ps.setMonth(s.getMonth()-1);ps.setDate(1);pe.setMonth(e.getMonth()-1);pe.setDate(e.getDate());l='This Month';}
    else{s.setMonth(0,1);s.setHours(0,0,0,0);e.setHours(23,59,59,999);ps.setFullYear(s.getFullYear()-1);pe.setFullYear(e.getFullYear()-1);l='This Year';}
    return{currentRange:{start:s,end:e},prevRange:{start:ps,end:pe},label:l};
  }, [timeRange]);

  const ft = useMemo(()=>transactions.filter(t=>{const d=new Date(t.date);return d>=currentRange.start&&d<=currentRange.end&&t.type===reportType;}),[transactions,currentRange,reportType]);

  const totalAmount = useMemo(() => ft.reduce((a,t)=>a+Number(t.amount),0), [ft]);
  const avgAmount = ft.length > 0 ? totalAmount / ft.length : 0;
  const maxAmount = ft.length > 0 ? Math.max(...ft.map(t => Number(t.amount))) : 0;
  const txCount = ft.length;

  const trendData = useMemo(() => {
    const data=[]; const gdt=(d,tx)=>{const s=d.toISOString().split('T')[0];return tx.filter(t=>t.type===reportType&&t.date===s).reduce((a,c)=>a+Number(c.amount),0);};
    if(timeRange==='week'){const c=new Date(currentRange.start),p=new Date(prevRange.start);for(let i=0;i<7;i++){data.push({name:c.toLocaleDateString('id-ID',{weekday:'short'}),current:gdt(c,transactions),previous:gdt(p,transactions)});c.setDate(c.getDate()+1);p.setDate(p.getDate()+1);}}
    else if(timeRange==='month'){const dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate(),c=new Date(now.getFullYear(),now.getMonth(),1),p=currentRange.start.getMonth()===0?new Date(now.getFullYear()-1,11,1):new Date(now.getFullYear(),now.getMonth()-1,1);for(let i=1;i<=dim;i++){data.push({name:`${i}`,current:gdt(c,transactions),previous:gdt(p,transactions)});c.setDate(c.getDate()+1);p.setDate(p.getDate()+1);}}
    else{for(let i=0;i<12;i++){const ms=new Date(now.getFullYear(),i,1),pms=new Date(now.getFullYear()-1,i,1);const gmt=(m,y)=>transactions.filter(t=>{const d=new Date(t.date);return d.getMonth()===m.getMonth()&&d.getFullYear()===y&&t.type===reportType;}).reduce((a,c)=>a+Number(c.amount),0);data.push({name:ms.toLocaleDateString('id-ID',{month:'short'}),current:gmt(ms,now.getFullYear()),previous:gmt(pms,now.getFullYear()-1)});}}
    return data;
  }, [transactions,timeRange,currentRange,prevRange,reportType]);

  const catData = useMemo(()=>{const g={};ft.forEach(t=>{const n=t.category?.name||'Others';if(!g[n])g[n]=0;g[n]+=Number(t.amount);});return Object.entries(g).map(([n,v])=>({name:n,value:v})).sort((a,b)=>b.value-a.value);}, [ft]);
  const isExpense = reportType === 'expense';
  const displayedCats = showAllCats ? catData : catData.slice(0, 6);
  const hasMore = catData.length > 6;

  return (
    <div className="pb-24 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-sm">
            <BarChart size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Reports</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isExpense ? 'Expense' : 'Income'} analysis &middot; {label}
            </p>
          </div>
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
        <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs gap-1.5">
          <Download size={14} /> Excel
        </Button>
        <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs gap-1.5">
          <FileText size={14} /> PDF
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 sm:p-5 relative overflow-hidden col-span-2 sm:col-span-1">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" aria-hidden="true" />
          <div className="relative">
            <div className="flex items-center gap-1.5 mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isExpense ? 'bg-expense-bg' : 'bg-income/15'}`}>
                {isExpense ? <TrendingDown size={14} className="text-expense" /> : <TrendingUp size={14} className="text-income" />}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground font-mono tabular-nums">{formatCurrency(totalAmount)}</p>
            <p className="text-[10px] text-muted-foreground mt-1.5">{label}</p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Transactions</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground font-mono tabular-nums">{txCount}</p>
          <p className="text-[10px] text-muted-foreground mt-1.5">{catData.length} categories</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Average</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground font-mono tabular-nums">{formatCurrency(avgAmount)}</p>
          <p className="text-[10px] text-muted-foreground mt-1.5">per transaction</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Highest</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground font-mono tabular-nums">{formatCurrency(maxAmount)}</p>
          <p className="text-[10px] text-muted-foreground mt-1.5">single {isExpense ? 'expense' : 'income'}</p>
        </Card>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {catData.length > 0 ? displayedCats.map((c, i) => (
          <Card key={c.name} className="p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{backgroundColor: COLORS[i % COLORS.length]}} />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold truncate">{c.name}</p>
            </div>
            <p className="text-base font-bold text-foreground font-mono tabular-nums">{formatCurrency(c.value)}</p>
            {totalAmount > 0 && (
              <p className="text-[10px] text-muted-foreground mt-1.5">
                {((c.value / totalAmount) * 100).toFixed(1)}% of total
              </p>
            )}
            <div className="mt-2.5 w-full bg-muted h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                style={{
                  width: `${Math.min((c.value / Math.max(...catData.map(x => x.value))) * 100, 100)}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </Card>
        )) : (
          <Card className="col-span-full p-10 text-center border-dashed border-2">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <BarChart3 size={24} strokeWidth={1.5} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">No data for this period</p>
            <p className="text-xs text-muted-foreground">Try a different time range or category</p>
          </Card>
        )}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAllCats(!showAllCats)}
          className="w-full py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 border border-dashed border-border rounded-xl hover:bg-muted/30"
        >
          {showAllCats ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show all {catData.length} categories</>}
        </button>
      )}

      {/* Comparison Chart */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp size={14} strokeWidth={1.5} className="text-primary" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">Trend Comparison</h3>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-medium">
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
        <div className="h-[220px] sm:h-[280px]">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 2, bottom: 0, left: -4 }}>
                <defs>
                  <linearGradient id="trendCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} opacity={0.4} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10 }}
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
                  activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--color-background)', fill: 'var(--color-primary)' }}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No trend data available</div>
          )}
        </div>
      </Card>

      {/* Distribution + Category List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <PieChartIcon size={14} strokeWidth={1.5} className="text-primary" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">Distribution</h3>
          </div>
          {catData.length > 0 ? (
            <div className="h-[250px] sm:h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
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
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                <PieChartIcon size={20} strokeWidth={1.5} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No data</p>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-3 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowUpDown size={14} strokeWidth={1.5} className="text-primary" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">By Category</h3>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-semibold ml-auto">{catData.length}</span>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            {catData.map((item, i) => {
              const pct = totalAmount > 0 ? (item.value / totalAmount) * 100 : 0;
              return (
                <div key={item.name} className="flex items-center justify-between px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl hover:bg-muted/50 transition-colors group/item">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                    <span className="text-xs sm:text-sm font-medium text-foreground truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {/* Mini bar */}
                    <div className="hidden sm:block w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                    </div>
                    <span className="text-[10px] sm:text-xs tabular-nums text-muted-foreground font-medium w-10 sm:w-12 text-right">
                      {pct.toFixed(1)}%
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-foreground font-mono tabular-nums min-w-[70px] sm:min-w-[90px] text-right">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
              );
            })}
            {catData.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No categories yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}