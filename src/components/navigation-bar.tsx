"use client";

type NavigationBarProps = {
  onFreshClick?: () => void;
  refreshing?: boolean;
};

export function NavigationBar({ onFreshClick, refreshing }: NavigationBarProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold tracking-tight">NewsFeed</h1>
        <button
          onClick={onFreshClick}
          disabled={refreshing}
          aria-busy={refreshing}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 active:bg-slate-200 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
        >
          {refreshing ? "Refreshing…" : "Fresh"}
        </button>
      </nav>
    </header>
  );
}
