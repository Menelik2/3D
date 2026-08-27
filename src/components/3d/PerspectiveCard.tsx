"use client";

import Link from "next/link";
import { useRef } from "react";

type Props = {
  href: string;
  title: string;
  category: string;
  year: number | null;
  coverUrl: string | null;
};

export function PerspectiveCard({
  href,
  title,
  category,
  year,
  coverUrl,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -12;
    const ry = (px - 0.5) * 14;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative block aspect-[4/5] overflow-hidden bg-card border border-border transition-transform duration-200 ease-out will-change-transform"
      style={{
        transformStyle: "preserve-3d",
        transform: "perspective(900px) rotateX(0) rotateY(0)",
      }}
    >
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 transition group-hover:opacity-95" />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle at 50% 80%, rgba(225,29,72,0.25), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 flex items-end p-6">
        <div style={{ transform: "translateZ(40px)" }}>
          <p className="text-[10px] uppercase tracking-widest text-muted">
            {category}
            {year ? ` · ${year}` : ""}
          </p>
          <h3 className="mt-1 text-lg font-light text-foreground group-hover:text-accent transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
