import { NewsFeedClient } from "@/components/news-feed-client";
import { fetchLatestArticles } from "@/lib/fetch-articles";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = await fetchLatestArticles();

  return <NewsFeedClient articles={articles} />;
}
