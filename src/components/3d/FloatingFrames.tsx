"use client";

/** Decorative CSS 3D film frames floating in the hero depth field. */
export function FloatingFrames() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden perspective-hero"
      aria-hidden
    >
      <div className="frame-3d frame-3d-a" />
      <div className="frame-3d frame-3d-b" />
      <div className="frame-3d frame-3d-c" />
      <div className="frame-3d frame-3d-d" />
    </div>
  );
}
