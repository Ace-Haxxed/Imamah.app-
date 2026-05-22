import { NextResponse } from 'next/server';
import { sql, ensureDb } from '@/lib/db';

export async function GET(req: Request) {
  try {
    await ensureDb();
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get('sport');

    if (!sport) return NextResponse.json({ error: 'Sport required' }, { status: 400 });

    const { rows } = await sql`
      SELECT * FROM standings
      WHERE sport = ${sport}
      ORDER BY points DESC, gd DESC, team_name ASC
    `;

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
