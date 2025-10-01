import { NewsFeedClient } from "@/components/news-feed-client";
import { fetchLatestArticles } from "@/lib/fetch-articles";

export const dynamic = "force-dynamic";

const INITIAL_LIMIT = 12;

export default async function Home() {
  const { articles, hasMore, lastFetchedAt } = await fetchLatestArticles({
    limit: INITIAL_LIMIT,
    offset: 0,
  });

  return (
    <NewsFeedClient
      initialArticles={articles}
      initialHasMore={hasMore}
      pageSize={INITIAL_LIMIT}
      initialLastFetchedAt={lastFetchedAt}
    />
  );
}
