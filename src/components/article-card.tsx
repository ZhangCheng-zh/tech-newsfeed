"use client";

import { useEffect, useMemo, useState } from "react";

import type { FeedArticle } from "@/lib/fetch-articles";

const FALLBACK_IMAGE = "/news-placeholder.svg";

type ArticleWithSource = FeedArticle & {
  sourceTitle?: string;
  sourceLogo?: string;
};

type ArticleCardProps = {
  article: ArticleWithSource;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const fallbackOrder = useMemo(() => {
    const order: string[] = [];
    const seen = new Set<string>();
    const candidates = [article.imageUrl, article.sourceLogo, FALLBACK_IMAGE];
    for (const candidate of candidates) {
      if (candidate && !seen.has(candidate)) {
        order.push(candidate);
        seen.add(candidate);
      }
    }
    return order;
  }, [article.imageUrl, article.sourceLogo]);

  const [imgIndex, setImgIndex] = useState(0);
  const imgSrc = fallbackOrder[imgIndex] ?? FALLBACK_IMAGE;
  const isFallback = imgIndex > 0;

  useEffect(() => {
    setImgIndex(0);
  }, [fallbackOrder]);
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  const handleImageError = () => {
    if (imgIndex < fallbackOrder.length - 1) {
      setImgIndex((prev) => prev + 1);
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`relative aspect-[16/9] overflow-hidden ${
          isFallback ? "bg-slate-50" : "bg-slate-100"
        } flex items-center justify-center`}
      >
        {article.mediaType === "video" ? (
          <span className="absolute left-3 top-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
            Video
          </span>
        ) : null}
        <img
          src={imgSrc}
          alt={article.title}
          loading="lazy"
          className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
            isFallback ? "object-contain p-6" : "object-cover"
          }`}
          onError={handleImageError}
        />
      </div>
      <div className="flex flex-col gap-3 p-6">
        {article.sourceTitle ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {article.sourceTitle}
          </span>
        ) : null}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-semibold text-slate-900 transition-colors hover:text-slate-600"
        >
          {article.title}
        </a>
        <p className="text-sm leading-relaxed text-slate-600">{article.snippet}</p>
        {formattedDate ? (
          <span className="text-xs text-slate-400">{formattedDate}</span>
        ) : null}
      </div>
    </article>
  );
}
