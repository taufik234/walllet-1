import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password.');
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Selamat Datang</h1>
        <p className="text-muted-foreground text-sm">Masuk untuk mengelola keuanganmu</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              placeholder="nama@email.com"
              className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-input text-primary focus:ring-ring" />
            <span className="text-muted-foreground">Ingat saya</span>
          </label>
          <Link to="#" className="text-primary hover:underline font-medium">Lupa password?</Link>
        </div>

        <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">
          {loading ? (
            <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          ) : (
            <>
              Masuk
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Belum punya akun?{' '}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Daftar Sekarang
        </Link>
      </div>
    </Card>
  );
}
