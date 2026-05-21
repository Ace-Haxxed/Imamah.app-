
import { NextResponse } from 'next/server';
import db from '@/lib/db';

const ADMIN_PASSWORD = 'JoseGonzales';

export async function GET(req: Request) {
  const password = req.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = {
    pending: (db.prepare("SELECT count(*) as count FROM team_registrations WHERE status = 'pending'").get() as any).count,
    approved: (db.prepare("SELECT count(*) as count FROM team_registrations WHERE status = 'approved'").get() as any).count,
    rejected: (db.prepare("SELECT count(*) as count FROM team_registrations WHERE status = 'rejected'").get() as any).count,
    total: (db.prepare("SELECT count(*) as count FROM team_registrations").get() as any).count,
  };

  return NextResponse.json(stats);
}
