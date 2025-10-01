import { refreshArticleStore } from "@/lib/fetch-articles";

async function main() {
  const { count, fetchedAt } = await refreshArticleStore();
  console.log(`Refreshed ${count} articles at ${fetchedAt}`);
}

main()
  .catch((error) => {
    console.error("Failed to refresh feeds", error);
    process.exitCode = 1;
  });
