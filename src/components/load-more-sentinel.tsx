"use client";

import { useEffect, useRef } from "react";

type LoadMoreSentinelProps = {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
};

export function LoadMoreSentinel({
  loading,
  hasMore,
  onLoadMore,
}: LoadMoreSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) {
      return;
    }

    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !loading) {
          onLoadMore();
        }
      },
      { rootMargin: "0px 0px 200px 0px" }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, onLoadMore]);

  return (
    <div
      ref={hasMore ? sentinelRef : null}
      className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500"
    >
      {!hasMore ? (
        <span>You&apos;re all caught up for now</span>
      ) : loading ? (
        <>
          <span className="h-2 w-2 animate-ping rounded-full bg-slate-400" />
          Loading more stories…
        </>
      ) : (
        <span>Keep scrolling to discover more stories</span>
      )}
    </div>
  );
}
