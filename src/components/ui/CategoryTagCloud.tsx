"use client";

import { useMemo } from "react";

type Props = {
  /** Category labels excluding "All" for cloud (or include All as center) */
  counts: Record<string, number>;
  active: string;
  onChange: (category: string) => void;
  /** Optional title above the cloud */
  label?: string;
};

/** Deterministic pseudo-random for stable layout per label */
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function CategoryTagCloud({ counts, active, onChange, label }: Props) {
  const tags = useMemo(() => {
    const entries = Object.entries(counts)
      .filter(([k, n]) => k !== "All" && n > 0)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    if (entries.length === 0) return [];

    const max = Math.max(...entries.map(([, n]) => n));
    const min = Math.min(...entries.map(([, n]) => n));
    const range = Math.max(max - min, 1);

    return entries.map(([name, count], index) => {
      const weight = (count - min) / range; // 0..1
      const sizeRem = 0.7 + weight * 1.15; // ~0.7rem – 1.85rem
      const opacity = 0.45 + weight * 0.55;
      const h = hash(name);
      // slight vertical offset for organic cloud feel
      const offsetY = ((h % 7) - 3) * 3;
      const rotate = ((h % 5) - 2) * 1.2;
      return {
        name,
        count,
        sizeRem,
        opacity,
        offsetY,
        rotate,
        order: index,
      };
    });
  }, [counts]);

  if (tags.length === 0) return null;

  const total = counts.All ?? tags.reduce((s, t) => s + t.count, 0);

  return (
    <div className="mb-10 relative">
      {label && (
        <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-muted text-center">
          {label}
        </p>
      )}

      <div className="relative overflow-hidden border border-border/80 bg-card/15 px-4 py-10 sm:px-8 sm:py-12">
        {/* atmospheric backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(225,29,72,0.07), transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-5 sm:gap-y-3 max-w-3xl mx-auto">
          {/* All reset */}
          <button
            type="button"
            onClick={() => onChange("All")}
            className={`uppercase tracking-[0.2em] transition-all duration-300 ${
              active === "All"
                ? "text-accent scale-105"
                : "text-muted/70 hover:text-foreground"
            }`}
            style={{ fontSize: "0.65rem" }}
            title={`${total} total`}
          >
            All
            <span className="ml-1.5 tabular-nums opacity-50">{total}</span>
          </button>

          {tags.map((tag) => {
            const isActive = active === tag.name;
            return (
              <button
                key={tag.name}
                type="button"
                onClick={() => onChange(isActive ? "All" : tag.name)}
                title={`${tag.count} ${tag.count === 1 ? "item" : "items"}`}
                className={`relative font-light tracking-wide transition-all duration-300 ease-out will-change-transform ${
                  isActive
                    ? "text-accent z-10"
                    : "text-foreground/80 hover:text-accent"
                }`}
                style={{
                  fontSize: `${tag.sizeRem}rem`,
                  opacity: isActive ? 1 : tag.opacity,
                  transform: isActive
                    ? `translateY(${tag.offsetY}px) scale(1.08)`
                    : `translateY(${tag.offsetY}px) rotate(${tag.rotate}deg)`,
                  textShadow: isActive
                    ? "0 0 28px rgba(225,29,72,0.45)"
                    : undefined,
                }}
              >
                {tag.name}
                <span
                  className="ml-1 align-super font-mono text-[0.55em] opacity-40 tabular-nums"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {tag.count}
                </span>
              </button>
            );
          })}
        </div>

        {active !== "All" && (
          <p className="relative mt-8 text-center text-[10px] uppercase tracking-[0.25em] text-muted">
            Filtered by{" "}
            <span className="text-accent">{active}</span>
            {" · "}
            <button
              type="button"
              onClick={() => onChange("All")}
              className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Clear
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
