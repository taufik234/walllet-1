import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, CartesianGrid } from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/utils';
import { CATEGORIES } from '../data/mockData';
import { cn } from '../utils/utils';

export default function Stats() {
    const { transactions, stats } = useTransactions();
    const [timeRange, setTimeRange] = useState('month'); // 'week' | 'month' | 'year'
    const [reportType, setReportType] = useState('expense'); // 'income' | 'expense'

    // Get current date helper
    const now = new Date();

    // Calculate Date Ranges (Current vs Previous)
    const { currentRange, prevRange, label } = useMemo(() => {
        const start = new Date(now);
        const end = new Date(now);
        const prevStart = new Date(now);
        const prevEnd = new Date(now);
        let lbl = '';

        if (timeRange === 'week') {
            const day = start.getDay() || 7; // 1 (Mon) to 7 (Sun)
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() - day + 1); // Monday
            end.setHours(23, 59, 59, 999); // Today/End of week

            prevStart.setDate(start.getDate() - 7);
            prevEnd.setDate(end.getDate() - 7);
            lbl = 'Minggu Ini';
        } else if (timeRange === 'month') {
            start.setDate(1); // 1st of month
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            prevStart.setMonth(start.getMonth() - 1);
            prevStart.setDate(1);
            prevEnd.setMonth(end.getMonth() - 1);
            prevEnd.setDate(end.getDate()); // Compare same relative day
            lbl = 'Bulan Ini';
        } else {
            // Year
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            prevStart.setFullYear(start.getFullYear() - 1);
            prevEnd.setFullYear(end.getFullYear() - 1);
            lbl = 'Tahun Ini';
        }

        return { currentRange: { start, end }, prevRange: { start: prevStart, end: prevEnd }, label: lbl };
    }, [timeRange]);

    // Filter transactions for Pie Chart (Current Period Only)
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const d = new Date(t.date);
            return d >= currentRange.start && d <= currentRange.end && t.type === reportType;
        });
    }, [transactions, currentRange, reportType]);

    // Trend Data with Comparison
    const trendData = useMemo(() => {
        const data = [];

        // Helper to sum amounts for a specific date
        const getDailyTotal = (dateObj, txns) => {
            const dateStr = dateObj.toISOString().split('T')[0];
            return txns
                .filter(t => t.type === reportType && t.date === dateStr)
                .reduce((acc, curr) => acc + Number(curr.amount), 0);
        };

        if (timeRange === 'week') {
            // 7 Days (Mon-Sun)
            const currLoop = new Date(currentRange.start);
            const prevLoop = new Date(prevRange.start);
            for (let i = 0; i < 7; i++) {
                data.push({
                    name: currLoop.toLocaleDateString('id-ID', { weekday: 'short' }),
                    current: getDailyTotal(currLoop, transactions),
                    previous: getDailyTotal(prevLoop, transactions),
                    date: currLoop.toISOString().split('T')[0] // for debug/tooltip
                });
                currLoop.setDate(currLoop.getDate() + 1);
                prevLoop.setDate(prevLoop.getDate() + 1);
            }
        } else if (timeRange === 'month') {
            // Days of month
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const currLoop = new Date(now.getFullYear(), now.getMonth(), 1);
            const prevLoop = currentRange.start.getMonth() === 0 ?
                new Date(now.getFullYear() - 1, 11, 1) :
                new Date(now.getFullYear(), now.getMonth() - 1, 1);

            for (let i = 1; i <= daysInMonth; i++) {
                data.push({
                    name: `${i}`,
                    current: getDailyTotal(currLoop, transactions),
                    previous: getDailyTotal(prevLoop, transactions),
                    date: currLoop.toISOString().split('T')[0]
                });
                currLoop.setDate(currLoop.getDate() + 1);
                prevLoop.setDate(prevLoop.getDate() + 1);
            }
        } else {
            // Year: Monthly breakdown
            for (let i = 0; i < 12; i++) {
                const monthStart = new Date(now.getFullYear(), i, 1);
                const prevMonthStart = new Date(now.getFullYear() - 1, i, 1);

                // Sum whole month
                const getMonthTotal = (mStart, yr) => {
                    return transactions
                        .filter(t => {
                            const d = new Date(t.date);
                            return d.getMonth() === mStart.getMonth() && d.getFullYear() === yr && t.type === reportType;
                        })
                        .reduce((acc, c) => acc + Number(c.amount), 0);
                };

                data.push({
                    name: monthStart.toLocaleDateString('id-ID', { month: 'short' }),
                    current: getMonthTotal(monthStart, now.getFullYear()),
                    previous: getMonthTotal(prevMonthStart, now.getFullYear() - 1),
                });
            }
        }

        return data;
    }, [transactions, timeRange, currentRange, prevRange, reportType]);

    // Data for Pie Chart (Aggregated from filtered)
    const categoryData = useMemo(() => {
        const grouped = filteredTransactions.reduce((acc, curr) => {
            // Use category name from joined object, fallback to 'Lainnya'
            const catName = curr.category?.name || 'Lainnya';
            if (!acc[catName]) {
                acc[catName] = 0;
            }
            acc[catName] += Number(curr.amount);
            return acc;
        }, {});

        return Object.entries(grouped)
            .map(([name, value]) => ({
                name,
                value
            }))
            .sort((a, b) => b.value - a.value);
    }, [filteredTransactions]);

    // Colors for the chart
    const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981'];
    const themeColor = reportType === 'income' ? '#10b981' : '#6366f1'; // Emerald for income, Indigo for expense

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-24">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Laporan Keuangan</h1>

                <div className="flex gap-2">
                    {/* Report Type Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setReportType('expense')}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                                reportType === 'expense' ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            Pengeluaran
                        </button>
                        <button
                            onClick={() => setReportType('income')}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                                reportType === 'income' ? "bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            Pemasukan
                        </button>
                    </div>

                    {/* Time Range Filter */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setTimeRange('week')}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                                timeRange === 'week' ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            Minggu Ini
                        </button>
                        <button
                            onClick={() => setTimeRange('month')}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                                timeRange === 'month' ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            Bulan Ini
                        </button>
                        <button
                            onClick={() => setTimeRange('year')}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                                timeRange === 'year' ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            )}
                        >
                            Tahun Ini
                        </button>
                    </div>
                </div>
            </div>
            {/* Summary Cards - Grid of Total + Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {/* 1. Total Card (Main Highlight) */}
                <div className={`col-span-2 sm:col-span-1 md:col-span-1 bg-gradient-to-br ${reportType === 'income' ? 'from-emerald-600 to-emerald-900 border-emerald-500/50 shadow-emerald-900/20' : 'from-indigo-600 to-indigo-900 border-indigo-500/50 shadow-indigo-900/20'} border p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group shadow-lg`}>
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="w-20 h-20 bg-white rounded-full blur-2xl"></div>
                    </div>
                    <div>
                        <p className={`${reportType === 'income' ? 'text-emerald-200' : 'text-indigo-200'} text-xs font-semibold mb-1 uppercase tracking-wider`}>Total {reportType === 'income' ? 'Pemasukan' : 'Pengeluaran'}</p>
                        <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                            {formatCurrency(filteredTransactions.reduce((acc, t) => acc + Number(t.amount), 0))}
                        </h2>
                    </div>
                    <div className={`mt-4 text-xs ${reportType === 'income' ? 'text-emerald-100/80' : 'text-indigo-100/80'} font-medium`}>
                        {label}
                    </div>
                </div>

                {/* 2. Category Cards (Dynamic) */}
                {categoryData.length > 0 ? (
                    categoryData.map((cat, index) => (
                        <div key={cat.name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 dark:hover:border-slate-700 transition-colors group shadow-sm dark:shadow-none">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">{cat.name}</p>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                                    {formatCurrency(cat.value)}
                                </h3>
                            </div>
                            <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${(cat.value / filteredTransactions.reduce((acc, t) => acc + Number(t.amount), 0)) * 100}%`,
                                        backgroundColor: COLORS[index % COLORS.length]
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed p-4 rounded-2xl flex items-center justify-center text-slate-500 text-sm">
                        Belum ada data {reportType === 'income' ? 'pemasukan' : 'pengeluaran'} untuk periode ini
                    </div>
                )}
            </div>

            {/* Comparison Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {timeRange === 'week' ? 'Perbandingan: Minggu Ini vs Lalu' :
                            timeRange === 'month' ? 'Perbandingan: Bulan Ini vs Lalu' :
                                'Perbandingan: Tahun Ini vs Lalu'}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className={`flex items-center gap-2 ${reportType === 'income' ? 'text-emerald-500 dark:text-emerald-400' : 'text-indigo-500 dark:text-indigo-400'}`}>
                            <span className={`w-2 h-2 rounded-full ${reportType === 'income' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span> Current
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></span> Previous
                        </div>
                    </div>
                </div>

                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={themeColor} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10 }}
                                dy={10}
                                interval="preserveStartEnd"
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                formatter={(value, name) => [
                                    formatCurrency(value),
                                    name === 'current' ? (timeRange === 'year' ? 'Tahun Ini' : 'Saat Ini') : (timeRange === 'year' ? 'Tahun Lalu' : 'Sebelumnya')
                                ]}
                            />
                            {/* Previous Period (Gray, Dashed or lighter) */}
                            <Area
                                type="monotone"
                                dataKey="previous"
                                stroke="#64748b"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                fillOpacity={0}
                                fill="transparent"
                                activeDot={false}
                            />
                            {/* Current Period (Primary Color) */}
                            <Area
                                type="monotone"
                                dataKey="current"
                                stroke={themeColor}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCurrent)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart & Breakdown */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Distribusi Kategori</h3>

                {categoryData.length > 0 ? (
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        Belum ada data pengeluaran untuk periode ini
                    </div>
                )}
            </div>

            {/* Breakdown List */}
            <div className="grid gap-4">
                {categoryData.map((item, index) => (
                    <div key={item.name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm dark:shadow-none">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-slate-900 dark:text-slate-200 font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500">
                                {filteredTransactions.reduce((acc, t) => acc + Number(t.amount), 0) > 0 ?
                                    ((item.value / filteredTransactions.reduce((acc, t) => acc + Number(t.amount), 0)) * 100).toFixed(1) + '%'
                                    : '0%'}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-slate-200">
                                {formatCurrency(item.value)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
