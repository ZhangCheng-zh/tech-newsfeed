import { NextResponse } from "next/server";

import { fetchLatestArticles } from "@/lib/fetch-articles";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseSearchParam(url.searchParams.get("limit"));
  const offset = parseSearchParam(url.searchParams.get("offset"));

  try {
    const { articles, hasMore, lastFetchedAt, total } = fetchLatestArticles({
      limit,
      offset,
    });

    return NextResponse.json({ articles, hasMore, lastFetchedAt, total });
  } catch (error) {
    console.error("Failed to fetch latest articles", error);
    return NextResponse.json(
      { error: "Failed to fetch latest articles." },
      { status: 500 }
    );
  }
}

function parseSearchParam(value: string | null): number | undefined {
  if (value === null) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}
