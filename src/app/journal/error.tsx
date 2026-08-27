"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function JournalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Journal Error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center pt-24 px-4">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.35em] text-muted mb-4">
          Journal
        </p>
        <h1 className="text-2xl sm:text-3xl font-light">
          Could not load this entry
        </h1>
        <p className="mt-3 text-sm text-muted">
          Journal content failed to load. Try again or return to the index.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-w-[140px] items-center justify-center bg-accent px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-accent-hover"
          >
            Try again
          </button>
          <Link
            href="/journal"
            className="inline-flex min-w-[140px] items-center justify-center border border-border px-6 py-3 text-xs uppercase tracking-widest text-muted hover:text-foreground"
          >
            All posts
          </Link>
        </div>
      </div>
    </div>
  );
}
