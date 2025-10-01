"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { FeedArticle } from "@/lib/fetch-articles";
import { ArticleGrid } from "./article-grid";
import { LoadMoreSentinel } from "./load-more-sentinel";
import { NavigationBar } from "./navigation-bar";

type NewsFeedClientProps = {
  articles: FeedArticle[];
};

export function NewsFeedClient({ articles }: NewsFeedClientProps) {
  const [loadingMore, setLoadingMore] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLoadMore = useCallback(() => {
    if (timeoutRef.current) {
      return;
    }

    setLoadingMore(true);
    timeoutRef.current = setTimeout(() => {
      setLoadingMore(false);
      timeoutRef.current = null;
    }, 1200);
  }, []);

  const handleFreshClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <NavigationBar onFreshClick={handleFreshClick} />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <ArticleGrid articles={articles} />
        <LoadMoreSentinel loading={loadingMore} onLoadMore={handleLoadMore} />
      </main>
    </div>
  );
}
