import { NextResponse } from 'next/server';
import { sql, ensureDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    await ensureDb();
    const data = await req.json();
    const { teamName, sport, city, yearFounded, about, contactName, contactEmail, website } = data;

    if (!teamName || !sport || !city || !contactName || !contactEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sql`
      INSERT INTO team_registrations (team_name, sport, city, year_founded, about, contact_name, contact_email, website)
      VALUES (${teamName}, ${sport}, ${city}, ${yearFounded}, ${about}, ${contactName}, ${contactEmail}, ${website})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await ensureDb();
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get('sport');
    const status = searchParams.get('status') || 'approved';

    if (!sport) return NextResponse.json({ error: 'Sport required' }, { status: 400 });

    const { rows } = await sql`
      SELECT * FROM team_registrations WHERE sport = ${sport} AND status = ${status} ORDER BY submitted_at DESC
    `;

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
