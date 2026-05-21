
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { teamName, sport, city, yearFounded, about, contactName, contactEmail, website } = data;

    if (!teamName || !sport || !city || !contactName || !contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO team_registrations (team_name, sport, city, year_founded, about, contact_name, contact_email, website)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(teamName, sport, city, yearFounded, about, contactName, contactEmail, website);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sport = searchParams.get('sport');
  const status = searchParams.get('status') || 'approved';

  if (!sport) return NextResponse.json({ error: 'Sport required' }, { status: 400 });

  const teams = db.prepare('SELECT * FROM team_registrations WHERE sport = ? AND status = ? ORDER BY submitted_at DESC')
    .all(sport, status);

  return NextResponse.json(teams);
}
