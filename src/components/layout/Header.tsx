
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="header-blur">
      <div className="container mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="text-primary font-headline text-2xl font-black tracking-tighter">
            IMAMAH <span className="italic font-light text-foreground/80">SPORTS</span>
          </div>
        </Link>

        <nav className="flex items-center gap-5 md:gap-8">
          <Link 
            href="/" 
            className={cn(
              "text-xs uppercase tracking-[0.2em] font-bold transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link 
            href="/sports" 
            className={cn(
              "text-xs uppercase tracking-[0.2em] font-bold transition-colors hover:text-primary",
              pathname.startsWith("/sports") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Sports
          </Link>
        </nav>
      </div>
    </header>
  );
}
