"use client";

import { useMemo, useState } from "react";
import type { PortfolioListItem } from "@/lib/data/public-cms";
import { PerspectiveCard } from "@/components/3d/PerspectiveCard";
import {
  CategoryFilter,
  buildCategoryOptions,
  matchesCategory,
} from "@/components/ui/CategoryFilter";
import { CategoryTagCloud } from "@/components/ui/CategoryTagCloud";

const FALLBACK = [
  "Music Videos",
  "Commercials",
  "Wedding Films",
  "Events",
  "Corporate Films",
  "Documentaries",
  "Photography",
  "Social Media Content",
];

export function WorkFilterGrid({ projects }: { projects: PortfolioListItem[] }) {
  const [active, setActive] = useState("All");

  const { categories, counts } = useMemo(
    () => buildCategoryOptions(projects, FALLBACK),
    [projects]
  );

  const filtered = useMemo(
    () => projects.filter((p) => matchesCategory(p.category, active)),
    [projects, active]
  );

  return (
    <div>
      <CategoryTagCloud
        counts={counts}
        active={active}
        onChange={setActive}
        label="Categories"
      />

      <CategoryFilter
        categories={categories}
        active={active}
        onChange={setActive}
        counts={counts}
      />

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
          {filtered.map((project) => (
            <PerspectiveCard
              key={project.id}
              href={`/work/${project.slug}`}
              title={project.title}
              category={project.category}
              year={project.year}
              coverUrl={project.cover_image_url}
            />
          ))}
        </div>
      ) : (
        <div className="border border-border bg-card/20 px-8 py-16 text-center">
          <p className="text-sm text-muted">
            No projects in <span className="text-foreground">{active}</span> yet.
          </p>
          <button
            type="button"
            onClick={() => setActive("All")}
            className="mt-6 text-[11px] uppercase tracking-widest text-accent hover:underline"
          >
            Show all work
          </button>
        </div>
      )}
    </div>
  );
}
