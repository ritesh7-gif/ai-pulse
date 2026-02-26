import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('cache.db');
const db = new Database(dbPath);

// Initialize the cache table
db.exec(`
  CREATE TABLE IF NOT EXISTS api_cache (
    key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )
`);

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

export const cache = {
    get: <T>(key: string): CacheEntry<T> | null => {
        const stmt = db.prepare('SELECT data, timestamp FROM api_cache WHERE key = ?');
        const row = stmt.get(key) as { data: string; timestamp: number } | undefined;

        if (!row) return null;

        try {
            return {
                data: JSON.parse(row.data),
                timestamp: row.timestamp
            };
        } catch (e) {
            console.error(`Error parsing cache for key ${key}:`, e);
            return null;
        }
    },

    set: <T>(key: string, data: T): void => {
        const stmt = db.prepare('INSERT OR REPLACE INTO api_cache (key, data, timestamp) VALUES (?, ?, ?)');
        stmt.run(key, JSON.stringify(data), Date.now());
    },

    delete: (key: string): void => {
        const stmt = db.prepare('DELETE FROM api_cache WHERE key = ?');
        stmt.run(key);
    },

    clear: (): void => {
        db.prepare('DELETE FROM api_cache').run();
    }
};
