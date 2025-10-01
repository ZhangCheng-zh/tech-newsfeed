import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "newsfeed.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) {
    return db;
  }

  ensureDirectory();
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  bootstrapSchema(db);
  return db;
}

function ensureDirectory() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

function bootstrapSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      snippet TEXT NOT NULL,
      link TEXT NOT NULL,
      image_url TEXT,
      published_at TEXT,
      source_id TEXT NOT NULL,
      fetched_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_articles_published_at
      ON articles (published_at DESC, id ASC);
  `);
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
