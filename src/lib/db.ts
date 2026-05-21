
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'imamah.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS team_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name TEXT NOT NULL,
    sport TEXT NOT NULL,
    city TEXT NOT NULL,
    year_founded TEXT,
    about TEXT,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    website TEXT,
    status TEXT DEFAULT 'pending',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS standings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sport TEXT NOT NULL,
    team_name TEXT NOT NULL,
    city TEXT NOT NULL,
    played INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    drawn INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,
    gd INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0
  );
`);

// Pre-seed Tamkeen FC
const seed = db.prepare('SELECT count(*) as count FROM standings WHERE team_name = ?').get('Tamkeen FC') as { count: number };
if (seed.count === 0) {
  db.prepare(`
    INSERT INTO standings (sport, team_name, city, played, won, drawn, lost, gd, points)
    VALUES ('soccer', 'Tamkeen FC', 'Redmond / Bellevue, WA', 0, 0, 0, 0, 0, 0)
  `).run();
}

export default db;
