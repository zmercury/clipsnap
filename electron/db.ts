import Database from 'better-sqlite3';
import path from 'node:path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'clips.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Initialize database
export function initDB() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS clips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      heading TEXT NOT NULL,
      content_html TEXT,
      content_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export interface Clip {
    id: number;
    heading: string;
    content_html: string;
    content_text: string;
    created_at: string;
}

export function getClips(): Clip[] {
    const stmt = db.prepare('SELECT * FROM clips ORDER BY created_at DESC');
    return stmt.all() as Clip[];
}

export function addClip(heading: string, content_html: string, content_text: string) {
    const stmt = db.prepare('INSERT INTO clips (heading, content_html, content_text) VALUES (?, ?, ?)');
    return stmt.run(heading, content_html, content_text);
}

export function deleteClip(id: number) {
    const stmt = db.prepare('DELETE FROM clips WHERE id = ?');
    return stmt.run(id);
}
