import { NextResponse } from 'next/server';
import db from '@/lib/db';

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
    const { status } = await req.json();
    const reviewedAt = new Date().toISOString();

    // Get current record to check for status transitions
    const currentTeam = db.prepare('SELECT * FROM team_registrations WHERE id = ?').get(id) as any;
    
    if (!currentTeam) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Update registration status
    const updateStmt = db.prepare(`
      UPDATE team_registrations 
      SET status = ?, reviewed_at = ?
      WHERE id = ?
    `);
    updateStmt.run(status, reviewedAt, id);

    // Robust sync with standings
    if (status === 'approved') {
      // Ensure the team is in the standings
      const existing = db.prepare('SELECT id FROM standings WHERE team_name = ? AND sport = ?').get(currentTeam.team_name, currentTeam.sport);
      if (!existing) {
        const insertStanding = db.prepare(`
          INSERT INTO standings (sport, team_name, city)
          VALUES (?, ?, ?)
        `);
        insertStanding.run(currentTeam.sport, currentTeam.team_name, currentTeam.city);
      }
    } else {
      // For ANY other status (pending, rejected), ensure they are NOT in the standings
      db.prepare('DELETE FROM standings WHERE team_name = ? AND sport = ?').run(currentTeam.team_name, currentTeam.sport);
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
    const team = db.prepare('SELECT * FROM team_registrations WHERE id = ?').get(id) as any;
    
    if (team) {
      // Remove from standings
      db.prepare('DELETE FROM standings WHERE team_name = ? AND sport = ?').run(team.team_name, team.sport);
      // Remove registration
      db.prepare('DELETE FROM team_registrations WHERE id = ?').run(id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Removal failed' }, { status: 500 });
  }
}
