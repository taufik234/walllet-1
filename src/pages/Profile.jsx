import { Download, Upload, LogOut, RefreshCw, User, Shield, Database, AlertTriangle, ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function SettingRow({ icon, label, desc, onClick, danger, value, arrow = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 flex items-center gap-3 hover:bg-muted/70 transition-all text-left group ${danger ? 'text-destructive' : ''}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
        danger ? 'bg-destructive/10' : 'bg-muted'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium ${danger ? 'text-destructive' : 'text-foreground'}`}>{label}</span>
        <p className={`text-xs ${danger ? 'text-destructive/60' : 'text-muted-foreground'}`}>{desc}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {value && <span className="text-xs text-muted-foreground font-mono">{value}</span>}
        {arrow && <ChevronRight size={14} strokeWidth={1.5} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />}
      </div>
    </button>
  );
}

export default function Profile() {
  const navigate = useNavigate(); const convex = useConvex(); const { logout, user } = useAuth(); const { transactions } = useTransactions();
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const gt = () => localStorage.getItem('auth_token');
  const lo = () => { logout(); navigate('/login'); };

  const ex = () => {
    if (!transactions?.length) { alert('Tidak ada data untuk diexport'); return; }
    setBackingUp(true);
    setTimeout(() => {
      const b = new Blob([JSON.stringify(transactions,null,2)],{type:'application/json'});
      const u=URL.createObjectURL(b); const a=document.createElement('a');
      a.href=u; a.download=`backup_${new Date().toISOString().split('T')[0]}.json`; a.click();
      URL.revokeObjectURL(u);
      setBackingUp(false);
    }, 300);
  };

  const im = (e) => {
    const f=e.target.files[0]; if(!f)return;
    setRestoring(true);
    const r=new FileReader();
    r.onload=(ev)=>{try{const d=JSON.parse(ev.target.result); if(Array.isArray(d)&&window.confirm(`Ditemukan ${d.length} transaksi. Timpa data saat ini?`)){localStorage.setItem('transactions',JSON.stringify(d));alert('Berhasil! Halaman akan dimuat ulang.');window.location.reload();}}catch{alert('File JSON tidak valid.');}finally{setRestoring(false);}};
    r.readAsText(f);
  };

  const fr = async () => {
    if(!window.confirm('Hapus semua data? Tindakan ini tidak bisa dibatalkan.'))return;
    const t=gt();
    try{await Promise.all([convex.mutation(api.transactions.deleteAll,{token:t}),convex.mutation(api.budgets.deleteAll,{token:t}),convex.mutation(api.wallets.resetAll,{token:t})]);alert('Semua data telah dihapus.');window.location.reload();}catch{alert('Gagal mereset data.');}
  };

  const da = async () => {
    if(!window.confirm('Hapus akun secara permanen?'))return;
    if(window.prompt('Ketik DELETE untuk konfirmasi')!=='DELETE'){alert('Dibatalkan');return;}
    try{await convex.mutation(api.users.deleteUser,{token:gt()});localStorage.removeItem('auth_token');navigate('/login');}catch{alert('Gagal menghapus akun.');}
  };

  const initials = user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'U';
  const isOver = transactions?.length > 0;

  return (
    <div className="pb-20 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-sm">
          <User size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Profile</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage your account and data</p>
        </div>
      </div>

      {/* User Card */}
      <Card className="p-5 relative overflow-hidden group">
        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-primary/5 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-primary/3 blur-2xl pointer-events-none" aria-hidden="true" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
            <span className="text-xl font-bold text-primary-foreground">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground truncate">{user?.name || 'User'}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email || 'N/A'}</p>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0 gap-1" onClick={lo}>
            <LogOut size={14} /> Logout
          </Button>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex gap-4 text-xs">
          <div>
            <p className="text-muted-foreground">Transactions</p>
            <p className="font-semibold text-foreground">{transactions?.length || 0}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Data status</p>
            <p className={`font-semibold ${isOver ? 'text-income' : 'text-muted-foreground'}`}>{isOver ? 'Active' : 'Empty'}</p>
          </div>
        </div>
      </Card>

      {/* Data Section */}
      <Card className="overflow-hidden divide-y divide-border">
        <div className="px-5 py-3 bg-muted/50 flex items-center gap-2">
          <Database size={12} className="text-muted-foreground" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Data Management</span>
        </div>
        <SettingRow
          icon={<Download size={16} strokeWidth={1.5} className={backingUp ? 'animate-spin' : ''} />}
          label="Backup Data"
          desc="Export all transactions to JSON file"
          onClick={ex}
          value={backingUp ? 'Processing...' : undefined}
        />
        <label className="w-full p-4 flex items-center gap-3 hover:bg-muted/70 transition-all text-left group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Upload size={16} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground">Restore Data</span>
            <p className="text-xs text-muted-foreground">{restoring ? 'Processing...' : 'Import from JSON backup file'}</p>
          </div>
          <input type="file" accept=".json" onChange={im} className="hidden" />
        </label>
      </Card>

      {/* Security Section */}
      <Card className="overflow-hidden divide-y divide-border">
        <div className="px-5 py-3 bg-muted/50 flex items-center gap-2">
          <Shield size={12} className="text-muted-foreground" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Account</span>
        </div>
        <SettingRow
          icon={<LogOut size={16} strokeWidth={1.5} />}
          label="Sign Out"
          desc="Logout from current session"
          onClick={lo}
          arrow
        />
      </Card>

      {/* Danger Zone */}
      <Card className="overflow-hidden divide-y divide-border border-destructive/30">
        <div className="px-5 py-3 bg-destructive/10 flex items-center gap-2">
          <AlertTriangle size={12} className="text-destructive" />
          <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider">Danger Zone</span>
        </div>
        <SettingRow
          icon={<RefreshCw size={16} strokeWidth={1.5} />}
          label="Factory Reset"
          desc="Delete all transactions, budgets, and wallets"
          onClick={fr}
          danger
        />
        <SettingRow
          icon={<Trash2 size={16} strokeWidth={1.5} />}
          label="Delete Account"
          desc="Permanently delete account and all data"
          onClick={da}
          danger
        />
      </Card>

      {/* Version */}
      <div className="text-center space-y-1">
        <p className="text-[10px] text-muted-foreground font-mono tracking-wide">Version 2.4</p>
        <p className="text-[10px] text-muted-foreground/40">Finance Dashboard</p>
      </div>
    </div>
  );
}
