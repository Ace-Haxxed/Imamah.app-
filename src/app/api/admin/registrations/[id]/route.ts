import { NextResponse } from 'next/server';
import { sql, ensureDb } from '@/lib/db';

const ADMIN_PASSWORD = 'JoseGonzales';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const password = req.headers.get('x-admin-password');

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureDb();
    const { status } = await req.json();
    const reviewedAt = new Date().toISOString();

    const { rows: teamRows } = await sql`SELECT * FROM team_registrations WHERE id = ${id}`;
    const currentTeam = teamRows[0];

    if (!currentTeam) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    await sql`
      UPDATE team_registrations
      SET status = ${status}, reviewed_at = ${reviewedAt}
      WHERE id = ${id}
    `;

    if (status === 'approved') {
      const { rows: existingRows } = await sql`
        SELECT id FROM standings WHERE team_name = ${currentTeam.team_name} AND sport = ${currentTeam.sport}
      `;
      if (existingRows.length === 0) {
        await sql`
          INSERT INTO standings (sport, team_name, city)
          VALUES (${currentTeam.sport}, ${currentTeam.team_name}, ${currentTeam.city})
        `;
      }
    } else {
      await sql`DELETE FROM standings WHERE team_name = ${currentTeam.team_name} AND sport = ${currentTeam.sport}`;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const password = req.headers.get('x-admin-password');

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureDb();
    const { rows: teamRows } = await sql`SELECT * FROM team_registrations WHERE id = ${id}`;
    const team = teamRows[0];

    if (team) {
      await sql`DELETE FROM standings WHERE team_name = ${team.team_name} AND sport = ${team.sport}`;
      await sql`DELETE FROM team_registrations WHERE id = ${id}`;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Removal failed' }, { status: 500 });
  }
}
