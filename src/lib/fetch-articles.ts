import Parser from "rss-parser";

import { newsSources } from "@/data/news-sources";
import {
  getArticlesPage,
  getLastFetchedAt,
  replaceArticles,
} from "./article-store";

export type FeedArticle = {
  id: string;
  title: string;
  snippet: string;
  link: string;
  imageUrl?: string;
  publishedAt?: string;
  sourceId: string;
  mediaType: "article" | "video";
  videoId?: string;
  channelId?: string;
  durationSeconds?: number;
};

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
            ? normaliseYoutubeItem(item, source.id, index, source.channelId)
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
  mediaGroup?: {
    "media:thumbnail"?: Array<{ $?: { url?: string } }>;
    "yt:videoId"?: string[];
    "yt:channelId"?: string[];
    "yt:duration"?: Array<{ $?: { seconds?: string } }>;
    "media:description"?: string[];
  };
  mediaDescription?: string;
  mediaThumbnails?: Array<{ url?: string } | { $?: { url?: string } }>;
  ytVideoId?: string;
  ytChannelId?: string;
  ytDuration?: { $?: { seconds?: string } } | string;
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
    mediaType: "article",
  };
}

function normaliseYoutubeItem(
  item: RawParserItem,
  sourceId: string,
  index: number,
  fallbackChannelId?: string
): FeedArticle | null {
  const videoId = extractYoutubeVideoId(item);
  const link =
    item.link?.trim() ||
    (videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined);
  const title = item.title?.trim();

  if (!title || !link) {
    return null;
  }

  const snippet = buildSnippet(item);
  const imageUrl = extractYoutubeImageUrl(item) ?? extractImageUrl(item);
  const publishedAt = item.isoDate || item.pubDate || undefined;
  const channelId = item.ytChannelId || extractYoutubeChannelId(item) || fallbackChannelId;
  const durationSeconds = extractYoutubeDuration(item);

  return {
    id: videoId || item.guid || `${sourceId}-${index}`,
    title,
    snippet,
    link,
    imageUrl,
    publishedAt,
    sourceId,
    mediaType: "video",
    videoId,
    channelId,
    durationSeconds,
  };
}

function buildSnippet(item: RawParserItem): string {
  const fromSnippet =
    item.contentSnippet ||
    item.summary ||
    item.mediaDescription ||
    item.mediaGroup?.["media:description"]?.[0];
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

function extractYoutubeImageUrl(item: RawParserItem): string | undefined {
  const thumbnails: Array<{ url?: string } | { $?: { url?: string } } | undefined> = [
    ...(item.mediaThumbnails ?? []),
    ...(item.mediaGroup?.["media:thumbnail"] ?? []),
  ];

  for (const media of thumbnails) {
    if (!media) {
      continue;
    }

    if (typeof media === "object" && "url" in media && media.url) {
      return media.url;
    }

    if (
      typeof media === "object" &&
      "$" in media &&
      media.$ &&
      media.$.url
    ) {
      return media.$.url;
    }
  }

  return undefined;
}

function extractYoutubeVideoId(item: RawParserItem): string | undefined {
  if (item.ytVideoId) {
    return item.ytVideoId;
  }

  const fromGroup = item.mediaGroup?.["yt:videoId"]?.[0];
  if (typeof fromGroup === "string" && fromGroup.trim()) {
    return fromGroup.trim();
  }

  if (item.guid?.startsWith("yt:video:")) {
    return item.guid.replace("yt:video:", "");
  }

  const linkMatch = item.link?.match(/v=([^&]+)/);
  if (linkMatch) {
    return linkMatch[1];
  }

  return undefined;
}

function extractYoutubeChannelId(item: RawParserItem): string | undefined {
  if (item.ytChannelId) {
    return item.ytChannelId;
  }

  const fromGroup = item.mediaGroup?.["yt:channelId"]?.[0];
  if (typeof fromGroup === "string" && fromGroup.trim()) {
    return fromGroup.trim();
  }

  return undefined;
}

function extractYoutubeDuration(item: RawParserItem): number | undefined {
  if (typeof item.ytDuration === "string") {
    const parsed = Number.parseInt(item.ytDuration, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  const fromItem = item.ytDuration?.$?.seconds;
  if (fromItem) {
    const parsed = Number.parseInt(fromItem, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  const fromGroup = item.mediaGroup?.["yt:duration"]?.[0]?.$?.seconds;
  if (fromGroup) {
    const parsed = Number.parseInt(fromGroup, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}
