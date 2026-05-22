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

    const [pending, approved, rejected, total] = await Promise.all([
      sql`SELECT count(*) as count FROM team_registrations WHERE status = 'pending'`,
      sql`SELECT count(*) as count FROM team_registrations WHERE status = 'approved'`,
      sql`SELECT count(*) as count FROM team_registrations WHERE status = 'rejected'`,
      sql`SELECT count(*) as count FROM team_registrations`,
    ]);

    return NextResponse.json({
      pending: parseInt(pending.rows[0].count as string),
      approved: parseInt(approved.rows[0].count as string),
      rejected: parseInt(rejected.rows[0].count as string),
      total: parseInt(total.rows[0].count as string),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
