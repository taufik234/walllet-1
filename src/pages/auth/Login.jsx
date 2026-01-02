import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/utils';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const success = login(formData.email, formData.password);
            if (success) {
                navigate('/');
            } else {
                setError('Login gagal');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl transition-colors duration-300">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                    <LogIn className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Selamat Datang</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Masuk untuk mengelola keuanganmu</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl text-center font-medium animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="email"
                            required
                            placeholder="nama@email.com"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-12 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                        <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Ingat saya</span>
                    </label>
                    <Link to="#" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Lupa password?</Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Masuk
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Belum punya akun?{' '}
                <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                    Daftar Sekarang
                </Link>
            </div>
        </div>
    );
}
