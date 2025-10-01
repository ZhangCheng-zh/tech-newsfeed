import { sql } from "@vercel/postgres";

let initialized = false;

export async function initDb() {
  if (initialized) {
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      snippet TEXT NOT NULL,
      link TEXT NOT NULL,
      image_url TEXT,
      published_at TIMESTAMPTZ,
      source_id TEXT NOT NULL,
      fetched_at TIMESTAMPTZ NOT NULL
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_articles_published_at
    ON articles (published_at DESC NULLS LAST, id ASC);
  `;

  initialized = true;
}

export { sql };
