"use client";

import { useCallback, useState } from "react";

import type { FeedArticle } from "@/lib/fetch-articles";
import { ArticleGrid } from "./article-grid";
import { LoadMoreSentinel } from "./load-more-sentinel";
import { NavigationBar } from "./navigation-bar";

type NewsFeedClientProps = {
  initialArticles: FeedArticle[];
  initialHasMore: boolean;
  pageSize: number;
};

export function NewsFeedClient({
  initialArticles,
  initialHasMore,
  pageSize,
}: NewsFeedClientProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        offset: String(articles.length),
        limit: String(pageSize),
      });
      const response = await fetch(`/api/articles?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: { articles: FeedArticle[]; hasMore: boolean } = await response.json();

      setArticles((prev) => [...prev, ...data.articles]);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Failed to load more articles", err);
      setError("Couldn't load more stories. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  }, [articles.length, hasMore, loadingMore, pageSize]);

  const handleFreshClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRetry = useCallback(() => {
    void handleLoadMore();
  }, [handleLoadMore]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <NavigationBar onFreshClick={handleFreshClick} />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <ArticleGrid articles={articles} />
        {error ? (
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
            >
              {error}
            </button>
          </div>
        ) : null}
        <LoadMoreSentinel
          hasMore={hasMore}
          loading={loadingMore}
          onLoadMore={handleLoadMore}
        />
      </main>
    </div>
  );
}
