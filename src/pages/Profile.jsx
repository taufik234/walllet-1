import { Download, Upload, LogOut, RefreshCw, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '@/context/TransactionContext';
import { useAuth } from '@/context/AuthContext';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Profile() {
  const navigate = useNavigate(); const convex = useConvex(); const { logout, user } = useAuth(); const { transactions } = useTransactions();
  const gt = () => localStorage.getItem('auth_token');
  const lo = () => { logout(); navigate('/login'); };
  const ex = () => { if (!transactions?.length) { alert('No data'); return; } const b = new Blob([JSON.stringify(transactions,null,2)],{type:'application/json'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=`backup_${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(u); };
  const im = (e) => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=(ev)=>{try{const d=JSON.parse(ev.target.result); if(Array.isArray(d)&&window.confirm(`Found ${d.length} tx. Overwrite?`)){localStorage.setItem('transactions',JSON.stringify(d));alert('OK');window.location.reload();}}catch{}}; r.readAsText(f); };
  const fr = async () => { if(!window.confirm('Delete all data?'))return; const t=gt(); try{await Promise.all([convex.mutation(api.transactions.deleteAll,{token:t}),convex.mutation(api.budgets.deleteAll,{token:t}),convex.mutation(api.wallets.resetAll,{token:t})]);alert('Reset');window.location.reload();}catch{}};
  const da = async () => { if(!window.confirm('Delete account?'))return; if(window.prompt('Type DELETE')!=='DELETE'){alert('Cancelled');return;} try{await convex.mutation(api.users.deleteUser,{token:gt()});localStorage.removeItem('auth_token');navigate('/login');}catch{}};

  return (
    <div className="pb-20 space-y-6">
      <div className="border-b border-border pb-3 flex items-center gap-3">
        <span className="w-1 h-5 rounded-full bg-primary" />
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
      </div>

      <Card className="p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary-foreground">
            {user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)||'U'}
          </span>
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">{user?.name||'User'}</p>
          <p className="text-sm text-muted-foreground">{user?.email||'N/A'}</p>
        </div>
      </Card>

      <Separator />

      <Card className="overflow-hidden divide-y divide-border">
        <div className="px-5 py-2.5 bg-muted">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Data</span>
        </div>
        <button onClick={ex} className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors text-left">
          <Download size={18} strokeWidth={1.5} className="text-muted-foreground" />
          <div>
            <span className="text-sm font-medium text-foreground">Backup</span>
            <p className="text-xs text-muted-foreground">Export to JSON</p>
          </div>
        </button>
        <label className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors text-left cursor-pointer">
          <Upload size={18} strokeWidth={1.5} className="text-muted-foreground" />
          <div>
            <span className="text-sm font-medium text-foreground">Restore</span>
            <p className="text-xs text-muted-foreground">Import from JSON</p>
          </div>
          <input type="file" accept=".json" onChange={im} className="hidden" />
        </label>
      </Card>

      <Separator />

      <Card className="overflow-hidden divide-y divide-border">
        <div className="px-5 py-2.5 bg-muted">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Account</span>
        </div>
        <button onClick={lo} className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors text-left">
          <LogOut size={18} strokeWidth={1.5} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Logout</span>
        </button>
      </Card>

      <Separator />

      <Card className="overflow-hidden divide-y divide-border border-destructive/30">
        <div className="px-5 py-2.5 bg-destructive/10">
          <span className="text-xs font-semibold text-destructive uppercase">Danger</span>
        </div>
        <button onClick={fr} className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors text-left">
          <RefreshCw size={18} strokeWidth={1.5} className="text-destructive" />
          <div>
            <span className="text-sm font-medium text-destructive">Factory Reset</span>
            <p className="text-xs text-destructive/60">Delete all data</p>
          </div>
        </button>
        <button onClick={da} className="w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors text-left">
          <Users size={18} strokeWidth={1.5} className="text-destructive" />
          <div>
            <span className="text-sm font-medium text-destructive">Delete Account</span>
            <p className="text-xs text-destructive/60">Permanently delete</p>
          </div>
        </button>
      </Card>

      <p className="text-center text-xs text-muted-foreground font-mono">v2.4</p>
    </div>
  );
}
