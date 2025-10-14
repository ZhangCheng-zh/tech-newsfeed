export type RawParserItem = {
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
