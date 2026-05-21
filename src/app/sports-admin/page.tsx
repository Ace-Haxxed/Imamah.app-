"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, X, LogIn, ExternalLink, Mail, User, Clock, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === 'JoseGonzales') {
      setIsAuthorized(true);
      fetchData();
    } else {
      setError('Invalid Access Credentials');
    }
  }

  async function fetchData() {
    setLoading(true);
    try {
      const [regRes, statsRes] = await Promise.all([
        fetch('/api/admin/registrations', { headers: { 'x-admin-password': 'JoseGonzales' } }),
        fetch('/api/admin/stats', { headers: { 'x-admin-password': 'JoseGonzales' } })
      ]);
      const regData = await regRes.json();
      const statsData = await statsRes.json();
      setRegistrations(regData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: number, action: 'approved' | 'rejected' | 'pending') {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': 'JoseGonzales' 
        },
        body: JSON.stringify({ status: action })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Action failed');
      }
      
      await fetchData();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="luxury-card p-12 w-full max-w-md border-primary/40">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-headline font-black uppercase tracking-tighter mb-2">Imamah Command</h1>
            <p className="text-muted-foreground italic text-sm">Enter the board's secure password</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Access Key" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-primary/20 h-12 text-center"
              />
              {error && <p className="text-destructive text-[10px] uppercase text-center font-bold">{error}</p>}
            </div>
            <Button type="submit" className="w-full btn-luxury h-12 flex items-center justify-center gap-2">
              <LogIn size={16} /> Authenticate
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const filteredRegistrations = (status: string) => {
    if (status === 'all') return registrations;
    return registrations.filter(r => r.status === status);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <span className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold">Admin Portal</span>
            <h1 className="text-5xl font-headline font-black">Board <span className="italic font-serif text-primary">Overview</span></h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
            <StatCard label="Pending" value={stats.pending} color="text-yellow-500" />
            <StatCard label="Approved" value={stats.approved} color="text-primary" />
            <StatCard label="Rejected" value={stats.rejected} color="text-destructive" />
            <StatCard label="Total" value={stats.total} color="text-foreground" />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs uppercase tracking-widest font-bold text-center">
            {error}
          </div>
        )}

        <Tabs defaultValue="pending" className="space-y-8">
          <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
            <TabsTrigger value="pending" className="tab-luxury">Pending</TabsTrigger>
            <TabsTrigger value="approved" className="tab-luxury">Approved</TabsTrigger>
            <TabsTrigger value="rejected" className="tab-luxury">Rejected</TabsTrigger>
            <TabsTrigger value="all" className="tab-luxury">All Submissions</TabsTrigger>
          </TabsList>

          {['pending', 'approved', 'rejected', 'all'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              {loading && registrations.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground animate-pulse uppercase tracking-widest text-xs">Syncing with database...</div>
              ) : filteredRegistrations(status).length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredRegistrations(status).map((reg) => (
                    <div key={reg.id} className="luxury-card p-8 group">
                      <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <div className="flex-1 space-y-6">
                          <div className="flex flex-wrap items-center gap-4">
                            <h3 className="text-2xl font-headline font-bold">{reg.team_name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="border-primary/40 text-primary uppercase text-[10px] rounded-none px-2">{reg.sport}</Badge>
                              <StatusBadge status={reg.status} />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <InfoItem icon={<MapPin size={14}/>} label="Location" value={reg.city} />
                            <InfoItem icon={<Calendar size={14}/>} label="Founded" value={reg.year_founded || 'N/A'} />
                            <InfoItem 
                              icon={<Clock size={14}/>} 
                              label="Submitted" 
                              value={hasMounted ? new Date(reg.submitted_at).toLocaleDateString() : '...'} 
                            />
                          </div>

                          <div className="space-y-2 border-t border-border pt-6">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">About Section</span>
                            <p className="italic text-foreground/80 leading-relaxed text-sm">
                              "{reg.about || "No biography provided."}"
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm bg-muted/30 p-4">
                            <InfoItem icon={<User size={14}/>} label="Contact" value={reg.contact_name} />
                            <InfoItem icon={<Mail size={14}/>} label="Email" value={reg.contact_email} />
                            {reg.website && (
                              <div className="flex items-center gap-2 text-primary hover:underline">
                                <ExternalLink size={14} />
                                <a href={reg.website} target="_blank" rel="noopener noreferrer" className="text-xs uppercase font-bold tracking-widest">Website</a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap lg:flex-col gap-3 justify-end items-end">
                          {reg.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleAction(reg.id, 'approved')}
                                disabled={loading}
                                className="flex items-center justify-center gap-2 border border-green-500/40 text-green-500 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-background transition-all disabled:opacity-50"
                              >
                                <Check size={14} /> Approve
                              </button>
                              <button 
                                onClick={() => handleAction(reg.id, 'rejected')}
                                disabled={loading}
                                className="flex items-center justify-center gap-2 border border-destructive/40 text-destructive px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-destructive hover:text-background transition-all disabled:opacity-50"
                              >
                                <X size={14} /> Reject
                              </button>
                            </>
                          )}
                          
                          {reg.status !== 'pending' && (
                             <button 
                               onClick={() => handleAction(reg.id, 'pending')}
                               disabled={loading}
                               className="flex items-center justify-center gap-2 border border-yellow-500/40 text-yellow-500 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-yellow-500 hover:text-background transition-all disabled:opacity-50"
                             >
                               <Clock size={14} /> Set Pending
                             </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-border italic text-muted-foreground">
                  No registrations found for this category.
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="luxury-card px-6 py-4 min-w-[120px]">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">{label}</div>
      <div className={cn("text-3xl font-headline font-black", color)}>{value}</div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
        {icon} {label}
      </div>
      <div className="font-medium text-xs">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    approved: 'bg-primary/10 text-primary border-primary/30',
    rejected: 'bg-destructive/10 text-destructive border-destructive/30'
  };
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-tighter border",
      colors[status as keyof typeof colors]
    )}>
      {status}
    </span>
  );
}
