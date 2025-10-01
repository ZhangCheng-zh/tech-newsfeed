"use client";

import type { FeedArticle } from "@/lib/fetch-articles";
import { newsSources } from "@/data/news-sources";
import { ArticleCard } from "./article-card";

type ArticleGridProps = {
  articles: FeedArticle[];
};

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <section className="grid gap-6 sm:grid-cols-2">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={{
            ...article,
            sourceTitle: SOURCE_META[article.sourceId]?.title,
            sourceLogo: SOURCE_META[article.sourceId]?.logoUrl,
          }}
        />
      ))}
    </section>
  );
}

type SourceMeta = {
  title: string;
  logoUrl?: string;
};

const SOURCE_META = newsSources.reduce<Record<string, SourceMeta>>(
  (acc, source) => {
    acc[source.id] = {
      title: source.title,
      logoUrl: source.logoUrl,
    };
    return acc;
  },
  {}
);
