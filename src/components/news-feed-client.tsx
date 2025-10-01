"use client";

import { useCallback, useState } from "react";

import type { FeedArticle } from "@/lib/fetch-articles";
import { ArticleGrid } from "./article-grid";
import { LoadMoreSentinel } from "./load-more-sentinel";
import { NavigationBar } from "./navigation-bar";

type NewsFeedClientProps = {
  initialArticles: FeedArticle[];
  initialHasMore: boolean;
  initialLastFetchedAt: string | null;
  pageSize: number;
};

export function NewsFeedClient({
  initialArticles,
  initialHasMore,
  initialLastFetchedAt,
  pageSize,
}: NewsFeedClientProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [lastFetchedAt, setLastFetchedAt] = useState(initialLastFetchedAt);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorAction, setErrorAction] = useState<"loadMore" | "refresh" | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || refreshing) {
      return;
    }

    setLoadingMore(true);
    setError(null);
    setErrorAction(null);

    try {
      const params = new URLSearchParams({
        offset: String(articles.length),
        limit: String(pageSize),
      });
      const response = await fetch(`/api/articles?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: {
        articles: FeedArticle[];
        hasMore: boolean;
        lastFetchedAt: string | null;
        total: number;
      } = await response.json();

      setArticles((prev) => [...prev, ...data.articles]);
      setHasMore(data.hasMore);
      setLastFetchedAt(data.lastFetchedAt);
    } catch (err) {
      console.error("Failed to load more articles", err);
      setError("Couldn't load more stories. Please try again.");
      setErrorAction("loadMore");
    } finally {
      setLoadingMore(false);
    }
  }, [articles.length, hasMore, loadingMore, pageSize, refreshing]);

  const handleFreshClick = useCallback(async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);
    setError(null);
    setErrorAction(null);

    try {
      const refreshResponse = await fetch("/api/refresh", {
        method: "POST",
      });

      if (!refreshResponse.ok) {
        throw new Error(`Refresh failed with status ${refreshResponse.status}`);
      }

      const params = new URLSearchParams({
        offset: "0",
        limit: String(pageSize),
      });
      const response = await fetch(`/api/articles?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Articles fetch failed with status ${response.status}`);
      }

      const data: {
        articles: FeedArticle[];
        hasMore: boolean;
        lastFetchedAt: string | null;
        total: number;
      } = await response.json();

      setArticles(data.articles);
      setHasMore(data.hasMore);
      setLastFetchedAt(data.lastFetchedAt);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to refresh articles", err);
      setError("Couldn't refresh stories. Please try again.");
      setErrorAction("refresh");
    } finally {
      setRefreshing(false);
    }
  }, [pageSize, refreshing]);

  const handleRetry = useCallback(() => {
    if (errorAction === "loadMore") {
      void handleLoadMore();
      return;
    }

    if (errorAction === "refresh") {
      void handleFreshClick();
    }
  }, [errorAction, handleFreshClick, handleLoadMore]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <NavigationBar onFreshClick={handleFreshClick} refreshing={refreshing} />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        {articles.length ? (
          <ArticleGrid articles={articles} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
            <p>No stories cached yet.</p>
            <p className="mt-2">Run `npm run refresh-feeds` to populate the latest news.</p>
          </div>
        )}
        {lastFetchedAt ? (
          <p className="text-center text-xs text-slate-400">
            Last updated {new Date(lastFetchedAt).toLocaleString()}
          </p>
        ) : null}
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
