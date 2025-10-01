import { closeDb } from "@/lib/db";
import { refreshArticleStore } from "@/lib/fetch-articles";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

let running = false;

async function runRefresh() {
  if (running) {
    console.warn("Refresh already in progress, skipping");
    return;
  }

  running = true;
  try {
    const { count, fetchedAt } = await refreshArticleStore();
    console.log(`Refreshed ${count} articles at ${fetchedAt}`);
  } catch (error) {
    console.error("Failed to refresh feeds", error);
  } finally {
    closeDb();
    running = false;
  }
}

function scheduleDailyRefresh() {
  void runRefresh();

  setInterval(() => {
    void runRefresh();
  }, ONE_DAY_MS);
}

function handleExit(signal: NodeJS.Signals) {
  console.log(`\nReceived ${signal}. Closing database and exiting.`);
  closeDb();
  process.exit(0);
}

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);

scheduleDailyRefresh();
