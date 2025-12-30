import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/utils';
import { CATEGORIES } from '../data/mockData';

export default function Stats() {
    const { transactions, stats } = useTransactions();

    const categoryData = useMemo(() => {
        // Only look at expenses
        const expenses = transactions.filter(t => t.type === 'expense');

        // Group by category
        const grouped = expenses.reduce((acc, curr) => {
            const cat = curr.category; // This is the ID
            if (!acc[cat]) {
                acc[cat] = 0;
            }
            acc[cat] += Number(curr.amount);
            return acc;
        }, {});

        // Convert to array and map to labels
        return Object.entries(grouped)
            .map(([id, value]) => {
                const catDef = CATEGORIES.expense.find(c => c.id === id);
                return {
                    name: catDef ? catDef.label : id,
                    value
                };
            })
            .sort((a, b) => b.value - a.value); // Sort descending
    }, [transactions]);

    // Colors for the chart
    const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Statistik Pengeluaran</h1>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Distribusi Pengeluaran</h3>

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
                        Belum ada data pengeluaran
                    </div>
                )}
            </div>

            {/* Breakdown List */}
            <div className="grid gap-4">
                {categoryData.map((item, index) => (
                    <div key={item.name} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-slate-200 font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500">
                                {((item.value / stats.totalExpense) * 100).toFixed(1)}%
                            </span>
                            <span className="font-bold text-slate-200">
                                {formatCurrency(item.value)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
