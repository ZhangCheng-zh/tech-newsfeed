"use client";

import type { FeedArticle } from "@/lib/fetch-articles";

type ArticleWithSource = FeedArticle & {
  sourceTitle?: string;
};

type ArticleCardProps = {
  article: ArticleWithSource;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {article.imageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}
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
