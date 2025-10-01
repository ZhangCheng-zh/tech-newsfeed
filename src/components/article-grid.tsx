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
          article={{ ...article, sourceTitle: SOURCE_MAP[article.sourceId] }}
        />
      ))}
    </section>
  );
}

const SOURCE_MAP = newsSources.reduce<Record<string, string>>((acc, source) => {
  acc[source.id] = source.title;
  return acc;
}, {});
