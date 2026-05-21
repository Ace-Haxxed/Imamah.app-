
import { NextResponse } from 'next/server';
import db from '@/lib/db';

const ADMIN_PASSWORD = 'JoseGonzales';

export async function GET(req: Request) {
  const password = req.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  let registrations;
  if (status) {
    registrations = db.prepare('SELECT * FROM team_registrations WHERE status = ? ORDER BY submitted_at DESC').all(status);
  } else {
    registrations = db.prepare('SELECT * FROM team_registrations ORDER BY submitted_at DESC').all();
  }

  return NextResponse.json(registrations);
}
