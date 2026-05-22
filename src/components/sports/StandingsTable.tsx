
"use client";

import { cn } from "@/lib/utils";

interface Standing {
  id: number;
  sport: string;
  team_name: string;
  city: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  points: number;
}

export function StandingsTable({ data, leagueName = "Imamah League — 2025/26" }: { data: Standing[], leagueName?: string }) {
  // Pad data to 8 rows
  const rows = [...data];
  while (rows.length < 8) {
    rows.push({ id: -1, sport: '', team_name: '', city: '', played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0 });
  }

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground">{leagueName}</h3>
      </div>
      
      <div className="w-full overflow-hidden border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-card/50 border-b border-border">
              <th className="py-3 px-3 md:py-4 md:px-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-10 md:w-12">Pos</th>
              <th className="py-3 px-3 md:py-4 md:px-4 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Team</th>
              <th className="py-3 px-2 md:py-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">P</th>
              <th className="py-3 px-2 md:py-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">W</th>
              <th className="py-3 px-2 md:py-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">D</th>
              <th className="py-3 px-2 md:py-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden md:table-cell">L</th>
              <th className="py-3 px-2 md:py-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">GD</th>
              <th className="py-3 px-3 md:py-4 md:px-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-12 md:w-16">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isReal = row.id !== -1;
              const isPromotion = idx < 3;
              const isRelegation = idx >= 6;

              return (
                <tr 
                  key={idx} 
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-[#181818] transition-colors",
                    !isReal && "opacity-40",
                    isPromotion && isReal && "bg-primary/5 border-l-4 border-l-primary",
                    isRelegation && isReal && "bg-destructive/5 border-l-4 border-l-destructive",
                    !isPromotion && !isRelegation && isReal && "border-l-4 border-l-transparent"
                  )}
                >
                  <td className="py-3 px-3 md:py-4 md:px-4 text-sm font-medium">{idx + 1}</td>
                  <td className="py-3 px-3 md:py-4 md:px-4">
                    <div className="flex items-center gap-2 md:gap-4">
                      {isReal ? (
                        <>
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                            {getInitials(row.team_name)}
                          </div>
                          <div>
                            <div className="text-sm font-bold">{row.team_name}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-tight hidden sm:block">{row.city}</div>
                          </div>
                        </>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 md:py-4 text-center text-sm hidden md:table-cell">{isReal ? row.played : 0}</td>
                  <td className="py-3 px-2 md:py-4 text-center text-sm hidden md:table-cell">{isReal ? row.won : 0}</td>
                  <td className="py-3 px-2 md:py-4 text-center text-sm hidden md:table-cell">{isReal ? row.drawn : 0}</td>
                  <td className="py-3 px-2 md:py-4 text-center text-sm hidden md:table-cell">{isReal ? row.lost : 0}</td>
                  <td className={cn(
                    "py-3 px-2 md:py-4 text-center text-sm font-medium",
                    isReal && row.gd > 0 ? "text-green-500" : isReal && row.gd < 0 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {isReal ? (row.gd > 0 ? `+${row.gd}` : row.gd) : 0}
                  </td>
                  <td className="py-3 px-3 md:py-4 md:px-4 text-center text-sm font-black text-primary">
                    {isReal ? row.points : 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-6 mt-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Promotion</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Relegation</span>
        </div>
      </div>
    </div>
  );
}
