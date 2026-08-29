"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_CANDIDATES = [
  "/brand/brand-optimized/meta-logo.mp4",
  "/brand/meta-logo.mp4",
  "https://raw.githubusercontent.com/Menelik2/3D/root/public/brand/brand-optimized/meta-logo.mp4",
];

/**
 * Cinematic 3D logo stage — depth plane, orbit rings, soft spotlight.
 * Video only plays when visible; reduced-motion users get static logo.
 */
export function LogoStage({
  logoVideoUrl,
  logoUrl,
}: {
  logoVideoUrl?: string;
  logoUrl?: string;
}) {
  const logo = logoUrl?.trim() || "/brand/meta-logo.jpg";
  const preferred = logoVideoUrl?.trim();
  const sources = preferred
    ? [preferred, ...VIDEO_CANDIDATES.filter((s) => s !== preferred)]
    : VIDEO_CANDIDATES;

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [srcIndex, setSrcIndex] = useState(0);
  const [useImage, setUseImage] = useState(false);
  const [ready, setReady] = useState(false);

  const videoSrc = !useImage && srcIndex < sources.length ? sources[srcIndex] : null;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !videoSrc) return;
    el.muted = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setUseImage(true);
      return;
    }

    let cancelled = false;
    const playIfVisible = () => {
      if (cancelled) return;
      el.play()?.catch(() => {});
    };

    if (typeof IntersectionObserver === "undefined") {
      playIfVisible();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) playIfVisible();
        else el.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [videoSrc]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    function onMove(e: PointerEvent) {
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.setProperty("--tilt-x", `${(-y * 10).toFixed(2)}deg`);
      stage.style.setProperty("--tilt-y", `${(x * 12).toFixed(2)}deg`);
    }
    function onLeave() {
      if (!stage) return;
      stage.style.setProperty("--tilt-x", "0deg");
      stage.style.setProperty("--tilt-y", "0deg");
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={stageRef} className="logo-stage mx-auto" aria-hidden={!videoSrc}>
      <div className="logo-stage-plate logo-stage-plate-back" />
      <div className="logo-stage-plate logo-stage-plate-mid" />
      <div className="logo-orbit logo-orbit-a" />
      <div className="logo-orbit logo-orbit-b" />
      <div className="logo-orbit logo-orbit-c" />
      <div className="logo-bloom" />
      <div className="logo-stage-media">
        {videoSrc ? (
          <video
            ref={videoRef}
            key={videoSrc}
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={logo}
            onCanPlay={() => setReady(true)}
            onError={() => {
              if (srcIndex + 1 < sources.length) setSrcIndex((i) => i + 1);
              else setUseImage(true);
            }}
            className={`logo-stage-video ${ready ? "is-ready" : ""}`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="logo-stage-video is-ready" />
        )}
        <div className="logo-stage-sheen" />
      </div>
      <div className="logo-reflection" />
    </div>
  );
}
