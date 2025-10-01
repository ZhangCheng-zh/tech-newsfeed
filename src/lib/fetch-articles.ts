import Parser from "rss-parser";

import { newsSources } from "@/data/news-sources";

export type FeedArticle = {
  id: string;
  title: string;
  snippet: string;
  link: string;
  imageUrl?: string;
  publishedAt?: string;
  sourceId: string;
};

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

const DEFAULT_ITEMS_PER_SOURCE = 6;
const MAX_ARTICLES = 64;

type FetchLatestArticlesOptions = {
  limit?: number;
  offset?: number;
};

export async function fetchLatestArticles({
  limit,
  offset = 0,
}: FetchLatestArticlesOptions = {}): Promise<{
  articles: FeedArticle[];
  hasMore: boolean;
}> {
  const feedPromises = newsSources.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.feedUrl);
      const items = feed.items?.slice(0, DEFAULT_ITEMS_PER_SOURCE) ?? [];

      return items
        .map((item, index) => normaliseItem(item, source.id, index))
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

  const safeLimit =
    typeof limit === "number" && Number.isFinite(limit) && limit > 0
      ? Math.floor(limit)
      : undefined;

  const bounded = allArticles.slice(0, MAX_ARTICLES);
  const safeOffset = Number.isFinite(offset) ? offset : 0;
  const start = Math.max(safeOffset, 0);
  const end =
    safeLimit ? Math.min(start + safeLimit, bounded.length) : bounded.length;

  const slice = bounded.slice(start, end);
  const hasMore = end < bounded.length;

  return { articles: slice, hasMore };
}

type RawParserItem = {
  title?: string;
  content?: string;
  contentSnippet?: string;
  contentEncoded?: string;
  summary?: string;
  link?: string;
  guid?: string;
  isoDate?: string;
  pubDate?: string;
  enclosure?: { url?: string };
  mediaContent?: Array<{ url?: string } | { $?: { url?: string } }>;
};

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
  };
}

function buildSnippet(item: RawParserItem): string {
  const fromSnippet = item.contentSnippet || item.summary;
  if (fromSnippet) {
    return truncateText(truncateWhitespace(fromSnippet));
  }

  const raw = item.contentEncoded || item.content || "";
  const text = stripHtml(raw);
  const cleaned = truncateWhitespace(text || "No summary available.");
  return truncateText(cleaned);
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "");
}

function truncateWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxLength = 220): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trim()}…`;
}

function extractImageUrl(item: RawParserItem): string | undefined {
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  if (Array.isArray(item.mediaContent)) {
    for (const media of item.mediaContent) {
      if (typeof media === "object" && media) {
        if ("url" in media && media.url) {
          return media.url;
        }

        if ("$" in media && media.$?.url) {
          return media.$.url;
        }
      }
    }
  }

  const html = item.contentEncoded || item.content;
  if (!html) {
    return undefined;
  }

  const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  return match ? match[1] : undefined;
}
