"use client";

import { useEffect, useMemo, useState } from "react";

import { newsSources } from "@/data/news-sources";

type SourceListModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SourceListModal({ open, onClose }: SourceListModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, SourceStatus>>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    const fetchStatuses = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/source-status");
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const body: { statuses?: SourceStatus[] } = await response.json();
        if (!body.statuses || cancelled) {
          return;
        }

        const map = body.statuses.reduce<Record<string, SourceStatus>>(
          (acc, status) => {
            acc[status.id] = status;
            return acc;
          },
          {}
        );

        setStatuses(map);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load source statuses", err);
          setError("Couldn't load source health. Please try again later.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchStatuses();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const sortedSources = useMemo(
    () =>
      [...newsSources].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      ),
    []
  );

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 px-4 py-6 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex h-[80vh] w-full max-w-3xl flex-col rounded-3xl border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sources</h2>
            <p className="text-sm text-slate-500">
              These are the feeds currently powering your news.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Close
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {error ? (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}
          <ul className="space-y-3">
            {sortedSources.map((source) => (
              <li
                key={source.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <LogoPreview title={source.title} logoUrl={source.logoUrl} />
                  <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <a
                      href={source.feedUrl}
                      className="block truncate text-sm font-semibold text-slate-900 hover:text-indigo-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.title}
                    </a>
                    <StatusBadge
                      status={statuses[source.id]}
                      loading={loading}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

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

type StatusBadgeProps = {
  status?: SourceStatus;
  loading: boolean;
};

function StatusBadge({ status, loading }: StatusBadgeProps) {
  if (loading && !status) {
    return getBadge({
      label: "Checking",
      symbol: "…",
      className: "text-slate-400",
    });
  }

  if (!status) {
    return getBadge({
      label: "Unknown",
      symbol: "▽",
      className: "text-slate-400",
    });
  }

  if (status.status === "ok") {
    return getBadge({
      label: "Healthy",
      symbol: "✓",
      className: "text-emerald-500",
    });
  }

  return getBadge({
    label: "Unreachable",
    symbol: "✕",
    className: "text-red-500",
  });
}

type BadgeOptions = {
  label: string;
  symbol: string;
  className: string;
};

function getBadge({ label, symbol, className }: BadgeOptions) {
  return (
    <span
      className={`flex h-7 min-w-[28px] shrink-0 items-center justify-center text-base font-semibold ${className}`}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{symbol}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

type LogoPreviewProps = {
  title: string;
  logoUrl?: string;
};

function LogoPreview({ title, logoUrl }: LogoPreviewProps) {
  const abbreviation = abbreviateTitle(title);

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${title} logo`}
        className="size-12 flex-shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1"
      />
    );
  }

  return (
    <div className="size-12 flex-shrink-0 rounded-xl border border-slate-200 bg-slate-100 text-center text-base font-semibold leading-[48px] text-slate-600">
      {abbreviation}
    </div>
  );
}

function abbreviateTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) {
    return "N/A";
  }

  const words = trimmed.split(/\s+/).slice(0, 2);
  const letters = words.map((word) => word.charAt(0).toUpperCase());
  const abbreviation = letters.join("").slice(0, 2);

  return abbreviation || trimmed.charAt(0).toUpperCase();
}
