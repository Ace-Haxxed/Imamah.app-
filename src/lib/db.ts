import { sql } from '@vercel/postgres';

export { sql };

let initialized = false;

export async function ensureDb() {
  if (initialized) return;

  await sql`
    CREATE TABLE IF NOT EXISTS team_registrations (
      id SERIAL PRIMARY KEY,
      team_name TEXT NOT NULL,
      sport TEXT NOT NULL,
      city TEXT NOT NULL,
      year_founded TEXT,
      about TEXT,
      contact_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      website TEXT,
      status TEXT DEFAULT 'pending',
      submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TIMESTAMPTZ
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS standings (
      id SERIAL PRIMARY KEY,
      sport TEXT NOT NULL,
      team_name TEXT NOT NULL,
      city TEXT NOT NULL,
      played INTEGER DEFAULT 0,
      won INTEGER DEFAULT 0,
      drawn INTEGER DEFAULT 0,
      lost INTEGER DEFAULT 0,
      gd INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0
    )
  `;

  const { rows } = await sql`SELECT count(*) as count FROM standings WHERE team_name = 'Tamkeen FC'`;
  if (parseInt(rows[0].count as string) === 0) {
    await sql`
      INSERT INTO standings (sport, team_name, city, played, won, drawn, lost, gd, points)
      VALUES ('soccer', 'Tamkeen FC', 'Redmond / Bellevue, WA', 0, 0, 0, 0, 0, 0)
    `;
  }

  initialized = true;
}
