"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function WorkError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Work Error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center pt-24 px-4">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.35em] text-muted mb-4">
          Work
        </p>
        <h1 className="text-2xl sm:text-3xl font-light">
          Couldn&apos;t load this project
        </h1>
        <p className="mt-3 text-sm text-muted">
          Portfolio data failed to load. Try again or browse all work.
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
            href="/work"
            className="inline-flex min-w-[140px] items-center justify-center border border-border px-6 py-3 text-xs uppercase tracking-widest text-muted hover:text-foreground"
          >
            All work
          </Link>
        </div>
      </div>
    </div>
  );
}
