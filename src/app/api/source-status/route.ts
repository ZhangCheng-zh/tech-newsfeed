import Parser from "rss-parser";
import { NextResponse } from "next/server";

import { newsSources } from "@/data/news-sources";

const parser = new Parser({
  requestOptions: {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      Accept:
        "application/atom+xml,application/rss+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    timeout: 10000,
  },
});

type SourceStatus =
  | {
      id: string;
      status: "ok";
      checkedAt: string;
      latencyMs: number;
    }
  | {
      id: string;
      status: "error";
      checkedAt: string;
      error: string;
    };

export async function GET() {
  const now = new Date();

  const statuses = await Promise.all(
    newsSources.map(async (source) => {
      const startedAt = Date.now();
      try {
        await parser.parseURL(source.feedUrl);
        return {
          id: source.id,
          status: "ok",
          checkedAt: new Date().toISOString(),
          latencyMs: Date.now() - startedAt,
        } satisfies SourceStatus;
      } catch (error) {
        console.warn(`Source health check failed for ${source.title}`, error);
        return {
          id: source.id,
          status: "error",
          checkedAt: now.toISOString(),
          error:
            error instanceof Error ? error.message : "Unable to load this feed.",
        } satisfies SourceStatus;
      }
    })
  );

  return NextResponse.json({ statuses });
}
