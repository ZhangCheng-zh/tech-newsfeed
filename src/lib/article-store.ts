import type { FeedArticle } from "./fetch-articles";
import { prisma } from "./db";

type PaginationOptions = {
  limit?: number;
  offset?: number;
};

export async function replaceArticles(
  articles: FeedArticle[],
  fetchedAt: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.article.deleteMany();
    if (articles.length === 0) {
      return;
    }

    await tx.article.createMany({
      data: articles.map((article) => ({
        id: article.id,
        title: article.title,
        snippet: article.snippet,
        link: article.link,
        imageUrl: article.imageUrl ?? null,
        publishedAt: article.publishedAt
          ? new Date(article.publishedAt)
          : null,
        sourceId: article.sourceId,
        fetchedAt: new Date(fetchedAt),
      })),
    });
  });
}

export async function getArticlesPage({
  limit,
  offset,
}: PaginationOptions): Promise<{
  articles: FeedArticle[];
  hasMore: boolean;
  total: number;
}> {
  const safeLimit =
    typeof limit === "number" && Number.isFinite(limit) && limit > 0
      ? Math.floor(limit)
      : undefined;
  const safeOffset =
    typeof offset === "number" && Number.isFinite(offset) && offset > 0
      ? Math.floor(offset)
      : 0;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      orderBy: [
        {
          publishedAt: {
            sort: "desc",
            nulls: "last",
          },
        },
        { id: "asc" },
      ],
      skip: safeOffset,
      take: safeLimit,
    }),
    prisma.article.count(),
  ]);

  const mapped: FeedArticle[] = articles.map((article) => ({
    id: article.id,
    title: article.title,
    snippet: article.snippet,
    link: article.link,
    imageUrl: article.imageUrl ?? undefined,
    publishedAt: article.publishedAt?.toISOString(),
    sourceId: article.sourceId,
  }));

  const hasMore = safeOffset + mapped.length < total;

  return {
    articles: mapped,
    hasMore,
    total,
  };
}

export async function getLastFetchedAt(): Promise<string | null> {
  const latest = await prisma.article.findFirst({
    orderBy: { fetchedAt: "desc" },
    select: { fetchedAt: true },
  });

  return latest?.fetchedAt.toISOString() ?? null;
}
