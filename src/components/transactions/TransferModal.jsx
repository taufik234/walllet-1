import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/utils';

export default function TransferModal({ isOpen, onClose }) {
    const { wallets, walletStats, addTransfer } = useTransactions();

    const [fromWalletId, setFromWalletId] = useState('');
    const [toWalletId, setToWalletId] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFromWalletId(wallets[0]?.id || '');
            setToWalletId(wallets[1]?.id || '');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setNote('');
            setError('');
        }
    }, [isOpen, wallets]);

    if (!isOpen) return null;

    const handleAmountChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (raw) {
            setAmount(new Intl.NumberFormat('id-ID').format(raw));
        } else {
            setAmount('');
        }
    };

    const numericAmount = Number(amount.replace(/\./g, ''));

    const fromWallet = wallets.find(w => w.id === fromWalletId);
    const toWallet = wallets.find(w => w.id === toWalletId);
    const fromBalance = walletStats[fromWalletId] ?? 0;

    const handleSwap = () => {
        const temp = fromWalletId;
        setFromWalletId(toWalletId);
        setToWalletId(temp);
    };

    const validate = () => {
        if (!fromWalletId || !toWalletId) return 'Pilih dompet asal dan tujuan.';
        if (fromWalletId === toWalletId) return 'Dompet asal dan tujuan tidak boleh sama.';
        if (!numericAmount || numericAmount <= 0) return 'Jumlah harus lebih dari 0.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        setError('');
        setLoading(true);
        try {
            await addTransfer({ fromWalletId, toWalletId, amount: numericAmount, date, note: note || 'Transfer' });
            onClose();
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const WalletSelector = ({ label, value, onChange, excludeId }) => (
        <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{label}</p>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer pr-10"
                >
                    {wallets.map(w => (
                        <option key={w.id} value={w.id} disabled={w.id === excludeId}>
                            {w.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {value && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 pl-1">
                    Saldo: <span className="font-semibold text-slate-600 dark:text-slate-300">{formatCurrency(walletStats[value] ?? 0)}</span>
                </p>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300 relative transition-colors">
                {/* Header Gradient Bar */}
                <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <ArrowLeftRight className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transfer</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Pindahkan saldo antar dompet</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Wallet Selectors */}
                        <div className="flex items-end gap-3">
                            <WalletSelector
                                label="Dari"
                                value={fromWalletId}
                                onChange={setFromWalletId}
                                excludeId={toWalletId}
                            />

                            {/* Swap Button */}
                            <button
                                type="button"
                                onClick={handleSwap}
                                className="mb-6 p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-500 transition-all active:scale-90 shrink-0"
                                title="Tukar"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <WalletSelector
                                label="Ke"
                                value={toWalletId}
                                onChange={setToWalletId}
                                excludeId={fromWalletId}
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jumlah</label>
                            <div className="relative mt-2">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-lg">Rp</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="0"
                                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pl-14 pr-4 text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-bold text-2xl"
                                    autoFocus
                                />
                            </div>
                            {fromBalance > 0 && numericAmount > fromBalance && (
                                <p className="text-xs text-amber-500 mt-1.5 pl-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Jumlah melebihi saldo dompet asal
                                </p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tanggal</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="mt-2 w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                            />
                        </div>

                        {/* Note */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Catatan (opsional)</label>
                            <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Tarik tunai, Top up, dll."
                                className="mt-2 w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 px-4 text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl px-4 py-3 text-rose-600 dark:text-rose-400 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Preview */}
                        {fromWallet && toWallet && numericAmount > 0 && (
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl px-4 py-3 text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                                <span className="font-semibold">{fromWallet.name}</span>
                                <ArrowRight className="w-4 h-4 text-indigo-400" />
                                <span className="font-semibold">{toWallet.name}</span>
                                <span className="ml-auto font-bold">{formatCurrency(numericAmount)}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !numericAmount || fromWalletId === toWalletId}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <Check className="w-5 h-5" />
                            )}
                            {loading ? 'Memproses...' : 'Simpan Transfer'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
