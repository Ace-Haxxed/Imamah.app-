import { NextResponse } from 'next/server';
import { sql, ensureDb } from '@/lib/db';

const ADMIN_PASSWORD = 'JoseGonzales';

export async function GET(req: Request) {
  const password = req.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureDb();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let registrations;
    if (status) {
      const result = await sql`SELECT * FROM team_registrations WHERE status = ${status} ORDER BY submitted_at DESC`;
      registrations = result.rows;
    } else {
      const result = await sql`SELECT * FROM team_registrations ORDER BY submitted_at DESC`;
      registrations = result.rows;
    }

    return NextResponse.json(registrations);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
