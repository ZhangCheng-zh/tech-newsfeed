import { NextResponse } from "next/server";

import { refreshArticleStore } from "@/lib/fetch-articles";

export async function POST() {
  try {
    const { count, fetchedAt } = await refreshArticleStore();
    return NextResponse.json({ count, fetchedAt });
  } catch (error) {
    console.error("Failed to refresh article store", error);
    return NextResponse.json(
      { error: "Failed to refresh feeds." },
      { status: 500 }
    );
  }
}
