import Database from 'better-sqlite3';
import path from 'node:path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'clips.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Initialize database
export function initDB() {
    // Create pages table
    db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Check if clips table needs page_id column
    const tableInfo = db.prepare("PRAGMA table_info(clips)").all() as any[];
    const hasPageId = tableInfo.some(col => col.name === 'page_id');

    if (!hasPageId) {
        // Add page_id column
        db.exec(`ALTER TABLE clips ADD COLUMN page_id INTEGER`);

        // Create a default page if none exist
        const pageCount = db.prepare('SELECT COUNT(*) as count FROM pages').get() as any;
        if (pageCount.count === 0) {
            db.prepare('INSERT INTO pages (name, icon) VALUES (?, ?)').run('My First Page', '📝');
            const defaultPage = db.prepare('SELECT id FROM pages LIMIT 1').get() as any;
            // Assign all existing clips to default page
            db.prepare('UPDATE clips SET page_id = ? WHERE page_id IS NULL').run(defaultPage.id);
        }
    }

    // Create clips table if not exists
    db.exec(`
    CREATE TABLE IF NOT EXISTS clips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      heading TEXT NOT NULL,
      content_html TEXT,
      content_text TEXT,
      category TEXT,
      page_id INTEGER,
      is_pinned INTEGER DEFAULT 0,
      content_type TEXT DEFAULT 'text',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
    )
  `);

    // Add columns if they don't exist (migration)
    const clipsTableInfo = db.prepare("PRAGMA table_info(clips)").all() as any[];
    const hasPinned = clipsTableInfo.some(col => col.name === 'is_pinned');
    const hasContentType = clipsTableInfo.some(col => col.name === 'content_type');

    if (!hasPinned) {
        db.exec(`ALTER TABLE clips ADD COLUMN is_pinned INTEGER DEFAULT 0`);
    }
    if (!hasContentType) {
        db.exec(`ALTER TABLE clips ADD COLUMN content_type TEXT DEFAULT 'text'`);
    }
}

export interface Page {
    id: number;
    name: string;
    icon: string;
    created_at: string;
}

export interface Clip {
    id: number;
    heading: string;
    content_html: string;
    content_text: string;
    category: string;
    page_id: number;
    is_pinned: number;
    content_type: string;
    created_at: string;
}

// Page functions
export function getPages(): Page[] {
    const stmt = db.prepare('SELECT * FROM pages ORDER BY created_at ASC');
    return stmt.all() as Page[];
}

export function addPage(name: string, icon: string = '📄') {
    const stmt = db.prepare('INSERT INTO pages (name, icon) VALUES (?, ?)');
    return stmt.run(name, icon);
}

export function updatePage(id: number, name: string, icon: string) {
    const stmt = db.prepare('UPDATE pages SET name = ?, icon = ? WHERE id = ?');
    return stmt.run(name, icon, id);
}

export function deletePage(id: number) {
    const stmt = db.prepare('DELETE FROM pages WHERE id = ?');
    return stmt.run(id);
}

// Clip functions (updated to filter by page)
export function getClips(pageId?: number): Clip[] {
    if (pageId) {
        const stmt = db.prepare('SELECT * FROM clips WHERE page_id = ? ORDER BY is_pinned DESC, created_at DESC');
        return stmt.all(pageId) as Clip[];
    }
    const stmt = db.prepare('SELECT * FROM clips ORDER BY is_pinned DESC, created_at DESC');
    return stmt.all() as Clip[];
}

export function addClip(heading: string, content_html: string, content_text: string, category: string, pageId: number, contentType: string = 'text') {
    const stmt = db.prepare('INSERT INTO clips (heading, content_html, content_text, category, page_id, content_type) VALUES (?, ?, ?, ?, ?, ?)');
    return stmt.run(heading, content_html, content_text, category, pageId, contentType);
}

export function updateClip(id: number, heading: string, content_html: string, content_text: string, category: string) {
    const stmt = db.prepare('UPDATE clips SET heading = ?, content_html = ?, content_text = ?, category = ? WHERE id = ?');
    return stmt.run(heading, content_html, content_text, category, id);
}

export function deleteClip(id: number) {
    const stmt = db.prepare('DELETE FROM clips WHERE id = ?');
    return stmt.run(id);
}

export function togglePinClip(id: number) {
    const stmt = db.prepare('UPDATE clips SET is_pinned = NOT is_pinned WHERE id = ?');
    return stmt.run(id);
}

export function searchClips(query: string): Clip[] {
    const stmt = db.prepare('SELECT * FROM clips WHERE heading LIKE ? OR content_text LIKE ? ORDER BY is_pinned DESC, created_at DESC');
    const searchPattern = `%${query}%`;
    return stmt.all(searchPattern, searchPattern) as Clip[];
}
