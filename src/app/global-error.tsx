"use client";

import { useEffect } from "react";

/**
 * Catches errors in the root layout. Must define its own <html> and <body>
 * because the root layout may have failed to render.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#f5f5f5",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420, padding: 24 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#a3a3a3",
              marginBottom: 16,
            }}
          >
            Critical error
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            The reel stopped.
          </h1>
          <p
            style={{
              marginTop: 16,
              fontSize: 14,
              color: "#a3a3a3",
              lineHeight: 1.6,
            }}
          >
            A critical error prevented the app from loading. Please try again.
          </p>
          {error.digest && (
            <p
              style={{
                marginTop: 12,
                fontSize: 10,
                fontFamily: "ui-monospace, monospace",
                color: "#666",
              }}
            >
              Ref: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 32,
              minWidth: 160,
              padding: "12px 24px",
              background: "#e11d48",
              color: "#fff",
              border: "none",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
