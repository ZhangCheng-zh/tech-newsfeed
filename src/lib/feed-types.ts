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
