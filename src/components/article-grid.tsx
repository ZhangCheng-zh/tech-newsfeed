"use client";

import type { Article } from "@/data/articles";
import { newsSources } from "@/data/news-sources";
import { ArticleCard } from "./article-card";

type ArticleGridProps = {
  articles: Article[];
};

export function ArticleGrid({ articles }: ArticleGridProps) {
  const sourceMap = newsSources.reduce<Record<string, string>>((acc, source) => {
    acc[source.id] = source.title;
    return acc;
  }, {});

  return (
    <section className="grid gap-6 sm:grid-cols-2">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={{ ...article, sourceTitle: sourceMap[article.sourceId] }}
        />
      ))}
    </section>
  );
}
