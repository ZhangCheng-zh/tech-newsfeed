ALTER TABLE "articles"
ADD COLUMN "media_type" TEXT NOT NULL DEFAULT 'article',
ADD COLUMN "video_id" TEXT,
ADD COLUMN "channel_id" TEXT,
ADD COLUMN "duration_seconds" INTEGER;
