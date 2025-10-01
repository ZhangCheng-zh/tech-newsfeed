import type { FeedArticle } from "./fetch-articles";
import { getDb } from "./db";

type PaginationOptions = {
  limit?: number;
  offset?: number;
};

export function replaceArticles(
  articles: FeedArticle[],
  fetchedAt: string
): void {
  const db = getDb();
  const insert = db.prepare(`
    INSERT INTO articles (
      id,
      title,
      snippet,
      link,
      image_url,
      published_at,
      source_id,
      fetched_at
    ) VALUES (@id, @title, @snippet, @link, @imageUrl, @publishedAt, @sourceId, @fetchedAt)
  `);

  const replaceTransaction = db.transaction(() => {
    db.prepare("DELETE FROM articles").run();
    for (const article of articles) {
      insert.run({
        ...article,
        imageUrl: article.imageUrl ?? null,
        publishedAt: article.publishedAt ?? null,
        fetchedAt,
      });
    }
  });

  replaceTransaction();
}

export function getArticles({ limit, offset }: PaginationOptions) {
  const db = getDb();
  const safeLimit =
    typeof limit === "number" && Number.isFinite(limit) && limit > 0
      ? Math.floor(limit)
      : undefined;
  const safeOffset =
    typeof offset === "number" && Number.isFinite(offset) && offset > 0
      ? Math.floor(offset)
      : 0;

  let sql = `SELECT id, title, snippet, link, image_url as imageUrl, published_at as publishedAt, source_id as sourceId
       FROM articles
       ORDER BY (published_at IS NULL), published_at DESC, id ASC`;

  if (safeLimit) {
    sql += " LIMIT @limit";
  }

  if (safeLimit || safeOffset) {
    sql += " OFFSET @offset";
  }

  const rows = db.prepare(sql).all({ limit: safeLimit, offset: safeOffset });

  return rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    snippet: row.snippet as string,
    link: row.link as string,
    imageUrl: (row.imageUrl as string | null) ?? undefined,
    publishedAt: (row.publishedAt as string | null) ?? undefined,
    sourceId: row.sourceId as string,
  })) satisfies FeedArticle[];
}

export function getArticlesPage(options: PaginationOptions) {
  const articles = getArticles(options);
  const total = getTotalCount();
  const { limit, offset } = options;
  const safeLimit =
    typeof limit === "number" && Number.isFinite(limit) && limit > 0
      ? Math.floor(limit)
      : articles.length;
  const safeOffset =
    typeof offset === "number" && Number.isFinite(offset) && offset > 0
      ? Math.floor(offset)
      : 0;

  const end = safeOffset + safeLimit;
  const hasMore = end < total;

  return { articles, hasMore, total };
}

export function getLastFetchedAt(): string | null {
  const db = getDb();
  const row = db
    .prepare("SELECT fetched_at as fetchedAt FROM articles ORDER BY fetched_at DESC LIMIT 1")
    .get() as { fetchedAt: string } | undefined;

  return row?.fetchedAt ?? null;
}

export function getTotalCount(): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM articles").get() as { count: number };
  return row.count;
}
