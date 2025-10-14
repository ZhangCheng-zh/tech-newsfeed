import type { FeedArticle } from "../feed-types";
import type { RawParserItem } from "../feed-parser-types";
import { buildSnippet, extractImageUrl } from "../feed-utils";

export function normaliseYoutubeItem(
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
  const channelId =
    item.ytChannelId || extractYoutubeChannelId(item) || fallbackChannelId;
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

    if (typeof media === "object" && "$" in media && media.$ && media.$.url) {
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
