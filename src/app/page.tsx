"use client";

import { useEffect, useRef, useState } from "react";

const articles = [
  {
    id: "1",
    title: "Global Markets Rally on Renewed Optimism",
    snippet:
      "Stocks across Europe and Asia surged as investors reacted to fresh economic data pointing to a resilient recovery and easing inflation pressures.",
    imageUrl:
      "https://images.unsplash.com/photo-1468078809804-4c7b3e60a478?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    title: "Cities Race to Build Climate-Ready Infrastructure",
    snippet:
      "Municipal leaders unveil a coordinated plan to retrofit aging transit systems while accelerating clean energy adoption in high-density neighborhoods.",
    imageUrl:
      "https://images.unsplash.com/photo-1451186859696-371d9477be93?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "3",
    title: "Breakthrough in Quantum Networking Demonstrated",
    snippet:
      "Researchers achieve record-breaking entanglement stability, paving the way for secure communication channels that transcend current internet limits.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "4",
    title: "Farm-to-Table Movement Expands to Urban Centers",
    snippet:
      "Local growers partner with restaurants to deliver seasonal menus while reducing food miles and spotlighting regenerative agriculture practices.",
    imageUrl:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "5",
    title: "Streaming Platforms Bet on Interactive Storytelling",
    snippet:
      "Major studios invest in choose-your-own adventure formats after early pilots draw record engagement from younger audiences worldwide.",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "6",
    title: "Healthcare Innovators Focus on Remote Diagnostics",
    snippet:
      "Startups roll out AI-assisted screening tools that bring specialized care to rural communities through lightweight, connected devices.",
    imageUrl:
      "https://images.unsplash.com/photo-1581091870627-3a344ec62c57?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Home() {
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | null = null;
    let isFetching = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isFetching) {
          isFetching = true;
          setLoadingMore(true);
          timeout = setTimeout(() => {
            setLoadingMore(false);
            isFetching = false;
          }, 1200);
        }
      },
      { rootMargin: "0px 0px 200px 0px" }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">NewsFeed</h1>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200">
            Fresh
          </button>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
        <section className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-3 p-6">
                <h2 className="text-xl font-semibold text-slate-900">{article.title}</h2>
                <p className="text-sm leading-relaxed text-slate-600">{article.snippet}</p>
              </div>
            </article>
          ))}
        </section>

        <div
          ref={sentinelRef}
          className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500"
        >
          {loadingMore ? (
            <>
              <span className="h-2 w-2 animate-ping rounded-full bg-slate-400" />
              Loading more stories…
            </>
          ) : (
            <span>Keep scrolling to discover more stories</span>
          )}
        </div>
      </main>
    </div>
  );
}
