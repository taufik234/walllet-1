import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency, formatDate } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2 } from 'lucide-react';

export default function SpendingChart() {
    const { transactions } = useTransactions();

    const data = useMemo(() => {
        // Generate last 7 days
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const dayExpense = transactions
                .filter(t => t.type === 'expense' && t.date === dateStr)
                .reduce((acc, curr) => acc + Number(curr.amount), 0);

            result.push({
                date: dateStr,
                dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
                amount: dayExpense
            });
        }
        return result;
    }, [transactions]);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-rose-500/10 p-2 rounded-lg">
                        <BarChart2 className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight">Pengeluaran</h3>
                        <p className="text-xs text-slate-500">7 Hari Terakhir</p>
                    </div>
                </div>
                <Link to="/stats" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors">
                    Lihat Statistik <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} /> {/* Rose color */}
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="dayName"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ color: '#f43f5e' }}
                            formatter={(value) => formatCurrency(value)}
                            labelStyle={{ display: 'none' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#f43f5e"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
