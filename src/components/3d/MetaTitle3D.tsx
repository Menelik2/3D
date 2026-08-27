"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic 3D animated wordmark — META PICTURES
 * Perspective tilt + letter stagger + layered depth glow.
 */
export function MetaTitle3D() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMove(e: PointerEvent) {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
    }
    function onLeave() {
      if (!el) return;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const meta = "META".split("");
  const pictures = "PICTURES".split("");

  return (
    <div ref={rootRef} className="meta-title-3d" aria-hidden>
      <div className="meta-title-glow" />
      <div className="meta-title-ring" />

      <div className="meta-title-stack">
        <div className="meta-title-line meta-title-line-meta">
          {meta.map((ch, i) => (
            <span
              key={`m-${i}`}
              className="meta-title-char"
              style={{ animationDelay: `${0.08 + i * 0.07}s` }}
            >
              {ch}
            </span>
          ))}
        </div>
        <div className="meta-title-line meta-title-line-pictures">
          {pictures.map((ch, i) => (
            <span
              key={`p-${i}`}
              className="meta-title-char meta-title-char-sub"
              style={{ animationDelay: `${0.4 + i * 0.05}s` }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>

      <div className="meta-title-underline" />
    </div>
  );
}
