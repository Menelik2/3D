"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.35em] text-muted mb-4">
          Something went wrong
        </p>
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight">
          This frame skipped.
        </h1>
        <p className="mt-4 text-sm text-muted leading-relaxed">
          An unexpected error occurred while loading this page. You can try
          again, or head back home.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[10px] text-muted/60">
            Ref: {error.digest}
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-w-[160px] items-center justify-center bg-accent px-6 py-3 text-xs font-medium uppercase tracking-widest text-white transition hover:bg-accent-hover"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-w-[160px] items-center justify-center border border-white/20 px-6 py-3 text-xs font-medium uppercase tracking-widest text-foreground transition hover:bg-white/5"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
