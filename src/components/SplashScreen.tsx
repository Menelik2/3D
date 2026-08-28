"use client";

import { useEffect, useState } from "react";

const SPLASH_MS = 2400;
const FADE_MS = 700;

/**
 * App-style splash: logo flash, then reveal the site.
 * Skips on /admin and when user prefers reduced motion.
 */
export function SplashScreen() {
  const [phase, setPhase] = useState<"show" | "fade" | "done">("show");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      setPhase("done");
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      return;
    }

    // Once per browser tab session
    try {
      if (sessionStorage.getItem("meta-splash-seen") === "1") {
        setPhase("done");
        return;
      }
    } catch {
      /* private mode */
    }

    const t1 = window.setTimeout(() => setPhase("fade"), SPLASH_MS);
    const t2 = window.setTimeout(() => {
      setPhase("done");
      try {
        sessionStorage.setItem("meta-splash-seen", "1");
      } catch {
        /* ignore */
      }
    }, SPLASH_MS + FADE_MS);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`splash-root ${
        phase === "fade" ? "splash-root--out" : ""
      }`}
      aria-hidden
      role="presentation"
    >
      <div className="splash-vignette" />
      <div className="splash-grain" />

      <div className="splash-center">
        {/* Logo mark — camera corners + stylized M */}
        <div className="splash-mark">
          <svg
            viewBox="0 0 120 120"
            className="splash-mark-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Viewfinder corners */}
            <path
              className="splash-corner"
              d="M18 38 V22 H34"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="square"
            />
            <path
              className="splash-corner splash-corner-tr"
              d="M86 22 H102 V38"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="square"
            />
            <path
              className="splash-corner splash-corner-bl"
              d="M18 82 V98 H34"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="square"
            />
            <path
              className="splash-corner splash-corner-br"
              d="M86 98 H102 V82"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="square"
            />
            {/* Red geometric M mark */}
            <path
              className="splash-m-red"
              d="M28 78 L28 42 L48 28 L62 48 L52 58 L48 52 L38 62 L38 78 Z"
              fill="#e11d48"
            />
            <path
              className="splash-m-white"
              d="M52 78 L52 55 L62 42 L78 28 L92 42 L92 78 L78 78 L78 48 L70 58 L70 78 Z"
              fill="#f5f5f5"
            />
            <circle className="splash-dot" cx="78" cy="34" r="4" fill="#e11d48" />
          </svg>
        </div>

        <div className="splash-divider" />

        <div className="splash-wordmark">
          <p className="splash-meta">
            M E T
            <span className="splash-a">
              A<span className="splash-tri" />
            </span>
          </p>
          <p className="splash-pictures">P I C T U R E S</p>
        </div>

        <p className="splash-tagline">Every frame has a story.</p>

        <div className="splash-bar">
          <span className="splash-bar-fill" />
        </div>
      </div>
    </div>
  );
}
