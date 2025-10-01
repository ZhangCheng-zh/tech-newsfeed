import type { FeedArticle } from "./fetch-articles";
import { initDb, sql } from "./db";

type PaginationOptions = {
  limit?: number;
  offset?: number;
};

type ArticleRow = {
  id: string;
  title: string;
  snippet: string;
  link: string;
  image_url: string | null;
  published_at: string | null;
  source_id: string;
  fetched_at: string;
};

export async function replaceArticles(
  articles: FeedArticle[],
  fetchedAt: string
): Promise<void> {
  await initDb();
  const client = await sql.connect();
  try {
    await client.sql`BEGIN`;
    await client.sql`DELETE FROM articles`;

    for (const article of articles) {
      await client.sql`
        INSERT INTO articles (
          id,
          title,
          snippet,
          link,
          image_url,
          published_at,
          source_id,
          fetched_at
        ) VALUES (
          ${article.id},
          ${article.title},
          ${article.snippet},
          ${article.link},
          ${article.imageUrl ?? null},
          ${article.publishedAt ? new Date(article.publishedAt).toISOString() : null},
          ${article.sourceId},
          ${new Date(fetchedAt).toISOString()}
        )
      `;
    }

    await client.sql`COMMIT`;
  } catch (error) {
    await client.sql`ROLLBACK`;
    throw error;
  } finally {
    client.release();
  }
}

export async function getArticlesPage({
  limit,
  offset,
}: PaginationOptions): Promise<{
  articles: FeedArticle[];
  hasMore: boolean;
  total: number;
}> {
  await initDb();

  const safeLimit =
    typeof limit === "number" && Number.isFinite(limit) && limit > 0
      ? Math.floor(limit)
      : undefined;
  const safeOffset =
    typeof offset === "number" && Number.isFinite(offset) && offset > 0
      ? Math.floor(offset)
      : 0;

  let selectQuery = `
    SELECT
      id,
      title,
      snippet,
      link,
      image_url,
      published_at,
      source_id,
      fetched_at
    FROM articles
    ORDER BY (published_at IS NULL), published_at DESC, id ASC
  `;

  const params: Array<string | number> = [];

  if (safeLimit !== undefined) {
    params.push(safeLimit);
    selectQuery += ` LIMIT $${params.length}`;
  }

  if (safeOffset > 0) {
    params.push(safeOffset);
    selectQuery += ` OFFSET $${params.length}`;
  }

  const [rowsResult, countResult] = await Promise.all([
    sql.query<ArticleRow>(selectQuery, params),
    sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM articles`,
  ]);

  const articles: FeedArticle[] = rowsResult.rows.map((row) => ({
    id: row.id,
    title: row.title,
    snippet: row.snippet,
    link: row.link,
    imageUrl: row.image_url ?? undefined,
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : undefined,
    sourceId: row.source_id,
  }));

  const total = countResult.rows[0]?.count ?? 0;
  const hasMore = safeOffset + articles.length < total;

  return {
    articles,
    hasMore,
    total,
  };
}

export async function getLastFetchedAt(): Promise<string | null> {
  await initDb();
  const result = await sql<{ fetched_at: string }>`
    SELECT fetched_at
    FROM articles
    ORDER BY fetched_at DESC
    LIMIT 1
  `;

  const fetchedAt = result.rows[0]?.fetched_at;
  return fetchedAt ? new Date(fetchedAt).toISOString() : null;
}
