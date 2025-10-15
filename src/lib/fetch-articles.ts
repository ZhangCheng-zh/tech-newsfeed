import Parser from "rss-parser";

import { newsSources } from "@/data/news-sources";
import {
  getArticlesPage,
  getLastFetchedAt,
  replaceArticles,
} from "./article-store";
import type { FeedArticle } from "./feed-types";
import type { RawParserItem } from "./feed-parser-types";
import { buildSnippet, extractImageUrl } from "./feed-utils";
import { normaliseYoutubeItem } from "./providers/youtube";

const parser = new Parser({
  requestOptions: {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      Accept:
        "application/atom+xml,application/rss+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    timeout: 15000,
  },
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
      ["media:group", "mediaGroup"],
      ["media:description", "mediaDescription"],
      ["media:thumbnail", "mediaThumbnails", { keepArray: true }],
      ["yt:videoId", "ytVideoId"],
      ["yt:channelId", "ytChannelId"],
      ["yt:duration", "ytDuration"],
    ],
  },
});

const DEFAULT_ITEMS_PER_SOURCE = 6;
const MAX_ARTICLES = 64;

type FetchLatestArticlesOptions = {
  limit?: number;
  offset?: number;
};

export async function collectFeedArticles(): Promise<FeedArticle[]> {
  const feedPromises = newsSources.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.feedUrl);
      const items = feed.items?.slice(0, DEFAULT_ITEMS_PER_SOURCE) ?? [];

      return items
        .map((item, index) =>
          source.type === "youtube"
            ? normaliseYoutubeItem(
                item,
                source.id,
                index,
                source.channelId
              )
            : normaliseItem(item, source.id, index)
        )
        .filter((item): item is FeedArticle => Boolean(item));
    } catch (error) {
      console.warn(`Failed to fetch feed for ${source.title}:`, error);
      return [];
    }
  });

  const allArticles = (await Promise.all(feedPromises)).flat();

  allArticles.sort((a, b) => {
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bDate - aDate;
  });

  return allArticles.slice(0, MAX_ARTICLES);
}

export async function refreshArticleStore(): Promise<{
  count: number;
  fetchedAt: string;
}> {
  const articles = await collectFeedArticles();
  const timestamp = new Date().toISOString();
  await replaceArticles(articles, timestamp);
  return { count: articles.length, fetchedAt: timestamp };
}

export async function fetchLatestArticles({
  limit,
  offset = 0,
}: FetchLatestArticlesOptions = {}): Promise<{
  articles: FeedArticle[];
  hasMore: boolean;
  lastFetchedAt: string | null;
  total: number;
}> {
  try {
    const [{ articles, hasMore, total }, lastFetchedAt] = await Promise.all([
      getArticlesPage({ limit, offset }),
      getLastFetchedAt(),
    ]);

    return {
      articles,
      hasMore,
      lastFetchedAt,
      total,
    };
  } catch (error) {
    console.error("Failed to fetch latest articles from database", error);
    return {
      articles: [],
      hasMore: false,
      lastFetchedAt: null,
      total: 0,
    };
  }
}

function normaliseItem(
  item: RawParserItem,
  sourceId: string,
  index: number
): FeedArticle | null {
  const title = item.title?.trim();
  const link = item.link?.trim();

  if (!title || !link) {
    return null;
  }

  const snippet = buildSnippet(item);
  const imageUrl = extractImageUrl(item);
  const publishedAt = item.isoDate || item.pubDate || undefined;

  return {
    id: item.guid || `${sourceId}-${index}`,
    title,
    snippet,
    link,
    imageUrl,
    publishedAt,
    sourceId,
    mediaType: "article",
  };
}

export type { FeedArticle };
