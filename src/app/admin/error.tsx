"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="w-full max-w-lg border border-border bg-card/40 p-8">
        <p className="text-[10px] uppercase tracking-widest text-muted">
          Admin · Error
        </p>
        <h1 className="mt-3 text-2xl font-light tracking-tight">
          Dashboard hit an error
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Something failed while loading this admin view. Retry, or return to
          the dashboard. If it keeps happening, check Supabase keys and network.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <pre className="mt-4 max-h-40 overflow-auto border border-border bg-background p-3 text-left text-[11px] text-red-300/90 font-mono whitespace-pre-wrap">
            {error.message}
          </pre>
        )}
        {error.digest && (
          <p className="mt-3 font-mono text-[10px] text-muted/60">
            Digest: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover"
          >
            Retry
          </button>
          <Link
            href="/admin"
            className="border border-border px-5 py-2.5 text-xs uppercase tracking-widest text-muted hover:text-foreground hover:border-accent/50 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="border border-border px-5 py-2.5 text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
          >
            Public site
          </Link>
        </div>
      </div>
    </div>
  );
}
