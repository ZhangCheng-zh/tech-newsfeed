import type { RawParserItem } from "./feed-parser-types";

export function buildSnippet(item: RawParserItem): string {
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

export function extractImageUrl(item: RawParserItem): string | undefined {
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

export function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "");
}

export function truncateWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function truncateText(value: string, maxLength = 220): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trim()}…`;
}
