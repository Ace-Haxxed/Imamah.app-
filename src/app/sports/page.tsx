
import { Header } from '@/components/layout/Header';
import { RegistrationForm } from '@/components/sports/RegistrationForm';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SPORTS = [
  {
    name: "Soccer",
    slug: "soccer",
    type: "LEAGUE",
    emoji: "⚽",
    href: "/sports/soccer"
  },
  {
    name: "Basketball",
    slug: "basketball",
    type: "TOURNAMENT",
    emoji: "🏀",
    href: "/sports/basketball"
  },
  {
    name: "American Football",
    slug: "american-football",
    type: "COMMUNITY",
    emoji: "🏈",
    href: "/sports/american-football"
  }
];

export default function SportsHub() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-14 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] gold-glow opacity-60 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <span className="inline-block border border-primary px-3 py-1 text-[10px] font-bold tracking-[0.3em] text-primary uppercase mb-8">
            Sports
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-headline font-black mb-6 leading-none">
            Ummah <span className="text-primary italic font-serif">Leagues</span>
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg italic">
            Celebrating excellence, brotherhood, and competition across the globe. Professional infrastructure for the community athlete.
          </p>
        </div>
      </section>

      {/* Sport Grid */}
      <section className="container mx-auto px-4 md:px-6 pb-16 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SPORTS.map((sport) => (
            <Link key={sport.slug} href={sport.href} className="group luxury-card p-6 md:p-10 block relative overflow-hidden">
              <div className="w-12 h-12 border border-primary/30 flex items-center justify-center text-2xl mb-8 group-hover:border-primary/60 transition-colors">
                {sport.emoji}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground uppercase">
                  {sport.type}
                </span>
                <h3 className="text-3xl font-headline font-bold">
                  {sport.name}
                </h3>
              </div>
              <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 transform transition-transform duration-300 group-hover:translate-x-2 text-primary">
                <ArrowRight size={24} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Registration Banner */}
      <section id="registration" className="border-y border-primary/20 bg-[#111111]">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-headline font-bold mb-4">Register Your Team</h2>
            <p className="text-muted-foreground italic text-lg">
              Bring your club into the Imamah fold. Gain access to verified standings, professional match reporting, and community recognition.
            </p>
          </div>
          <a href="#register-form" className="btn-luxury whitespace-nowrap">
            Join the League
          </a>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register-form" className="container mx-auto px-4 md:px-6 py-16 md:py-32 max-w-4xl">
        <div className="luxury-card p-6 md:p-12 border-primary/40">
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-2">Registration Portal</h2>
            <p className="text-muted-foreground">Please fill in your club details with precision.</p>
          </div>
          <RegistrationForm />
        </div>
      </section>

      <footer className="container mx-auto px-4 md:px-6 py-8 md:py-12 border-t border-border text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          &copy; 2025 Imamah Sports — The High-End Athletic Ummah
        </p>
      </footer>
    </div>
  );
}
