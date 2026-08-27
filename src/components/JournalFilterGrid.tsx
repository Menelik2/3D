"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { JournalListItem } from "@/lib/data/public-cms";
import {
  CategoryFilter,
  buildCategoryOptions,
  matchesCategory,
} from "@/components/ui/CategoryFilter";

const FALLBACK = [
  "Cinematography",
  "Production",
  "Behind the Scenes",
  "Creative Direction",
  "Filmmaking",
  "Photography",
  "News",
];

function formatDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export function JournalFilterGrid({ posts }: { posts: JournalListItem[] }) {
  const [active, setActive] = useState("All");

  const { categories, counts } = useMemo(
    () => buildCategoryOptions(posts, FALLBACK),
    [posts]
  );

  const filtered = useMemo(
    () => posts.filter((p) => matchesCategory(p.category, active)),
    [posts, active]
  );

  return (
    <div>
      <CategoryFilter
        categories={categories}
        active={active}
        onChange={setActive}
        counts={counts}
      />

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="group border border-border bg-card/20 overflow-hidden block transition hover:border-accent/30"
            >
              <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
                {post.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black" />
                )}
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                  {[post.category, formatDate(post.published_at)]
                    .filter(Boolean)
                    .join(" · ") || "Journal"}
                </p>
                <h2 className="mt-2 text-lg font-light tracking-tight group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-4 inline-block text-[10px] uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
                  Read →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-border bg-card/20 px-8 py-16 text-center">
          <p className="text-sm text-muted">
            No posts in <span className="text-foreground">{active}</span> yet.
          </p>
          <button
            type="button"
            onClick={() => setActive("All")}
            className="mt-6 text-[11px] uppercase tracking-widest text-accent hover:underline"
          >
            Show all posts
          </button>
        </div>
      )}
    </div>
  );
}
