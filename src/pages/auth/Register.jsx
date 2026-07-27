import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('Password konfirmasi tidak cocok'); return; }
    if (formData.password.length < 6) { setError('Password minimal 6 karakter'); return; }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Coba lagi.');
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Buat Akun Baru</h1>
        <p className="text-muted-foreground text-sm">Mulai kelola keuanganmu dengan lebih baik</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" required placeholder="John Doe"
              className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="email" required placeholder="nama@email.com"
              className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-3 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} required placeholder="••••••"
                className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground ml-1 uppercase tracking-wider">Konfirmasi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showPassword ? "text" : "password"} required placeholder="••••••"
                className="w-full bg-background border border-input rounded-lg py-2.5 pl-10 pr-10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="text-right">
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors">
            {showPassword ? "Sembunyikan Password" : "Lihat Password"}
          </button>
        </div>

        <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">
          {loading ? (
            <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          ) : (
            <>Daftar Akun <ArrowRight className="w-5 h-5" /></>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Masuk Disini
        </Link>
      </div>
    </Card>
  );
}
