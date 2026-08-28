"use client";

import { useEffect, useState } from "react";
import { META_SPLASH_LOGO } from "@/lib/logo-data";
import { useT } from "@/lib/i18n/context";

const SPLASH_MS = 2600;
const FADE_MS = 750;

/**
 * App-style splash: flash brand logo, then open the site.
 * Skips on /admin and when user prefers reduced motion.
 */
export function SplashScreen() {
  const t = useT();
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
      className={`splash-root ${phase === "fade" ? "splash-root--out" : ""}`}
      aria-hidden
      role="presentation"
    >
      <div className="splash-vignette" />
      <div className="splash-grain" />
      <div className="splash-pulse" />

      <div className="splash-center">
        <div className="splash-logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={META_SPLASH_LOGO}
            alt="META Pictures"
            className="splash-logo-img"
            width={640}
            height={360}
            draggable={false}
          />
        </div>

        <p className="splash-tagline">{t.splash.tagline}</p>

        <div className="splash-bar">
          <span className="splash-bar-fill" />
        </div>
      </div>
    </div>
  );
}
