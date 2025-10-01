"use client";

import type { Article } from "@/data/articles";

type ArticleWithSource = Article & {
  sourceTitle?: string;
};

type ArticleCardProps = {
  article: ArticleWithSource;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-3 p-6">
        <h2 className="text-xl font-semibold text-slate-900">{article.title}</h2>
        <p className="text-sm leading-relaxed text-slate-600">{article.snippet}</p>
        {article.sourceTitle ? (
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {article.sourceTitle}
          </span>
        ) : null}
      </div>
    </article>
  );
}
