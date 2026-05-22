
import { Header } from '@/components/layout/Header';
import { StandingsTable } from '@/components/sports/StandingsTable';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { sql, ensureDb } from '@/lib/db';

const SPORT_CONFIG = {
  soccer: { name: 'Soccer', emoji: '⚽', desc: 'The beautiful game, played by the Ummah.' },
  basketball: { name: 'Basketball', emoji: '🏀', desc: 'Elite competition on the hardwood.' },
  'american-football': { name: 'American Football', emoji: '🏈', desc: 'Power, strategy, and excellence.' },
};

export default async function SportPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const config = SPORT_CONFIG[sport as keyof typeof SPORT_CONFIG];

  if (!config) return <div>Sport not found</div>;

  await ensureDb();
  const { rows: standings } = await sql`SELECT * FROM standings WHERE sport = ${sport} ORDER BY points DESC, gd DESC`;
  const { rows: approvedTeams } = await sql`SELECT * FROM team_registrations WHERE sport = ${sport} AND status = 'approved'`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero */}
      <section className="relative pt-12 pb-24 border-b border-border overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] gold-glow opacity-30 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/sports" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary mb-12 transition-colors">
            <ChevronLeft size={14} /> Back to All Sports
          </Link>
          
          <div className="flex items-end gap-6 mb-4">
            <span className="text-5xl border border-primary/30 p-4 leading-none">{config.emoji}</span>
            <div>
              <h1 className="text-6xl md:text-8xl font-headline font-black leading-none">{config.name}</h1>
            </div>
          </div>
          <p className="max-w-xl text-muted-foreground italic text-lg">{config.desc}</p>
        </div>
      </section>

      {/* Standings */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <StandingsTable data={standings as any[]} />
          </div>
          
          <div className="space-y-12">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-6">Registered Clubs</h4>
              <div className="space-y-4">
                {approvedTeams.length > 0 ? (
                  approvedTeams.map(team => (
                    <div key={team.id} className="luxury-card p-6 border-primary/10">
                      <h5 className="font-headline font-bold text-lg">{team.team_name}</h5>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">{team.city} — Est. {team.year_founded}</p>
                      <p className="text-sm italic text-foreground/80 leading-relaxed line-clamp-3">
                        {team.about || "A premier athletic institution representing the local community."}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 border border-dashed border-border text-center text-muted-foreground italic text-sm">
                    {sport === 'american-football' 
                      ? "Be the first Muslim American Football team on Imamah" 
                      : "No registered teams yet for this league."}
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-primary/5 border border-primary/20 text-center">
              <h4 className="font-headline font-bold text-xl mb-2">Join the League</h4>
              <p className="text-sm text-muted-foreground italic mb-6">Take your place among the elite.</p>
              <Link href="/sports#registration" className="btn-luxury inline-block w-full">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-6 py-12 border-t border-border text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          &copy; 2025 Imamah Sports — Athletic Integrity
        </p>
      </footer>
    </div>
  );
}
