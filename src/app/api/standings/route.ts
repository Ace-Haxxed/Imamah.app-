
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sport = searchParams.get('sport');

  if (!sport) return NextResponse.json({ error: 'Sport required' }, { status: 400 });

  const standings = db.prepare(`
    SELECT * FROM standings 
    WHERE sport = ? 
    ORDER BY points DESC, gd DESC, team_name ASC
  `).all(sport);

  return NextResponse.json(standings);
}
