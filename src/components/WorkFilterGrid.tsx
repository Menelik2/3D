"use client";

import { useMemo, useState } from "react";
import type { PortfolioListItem } from "@/lib/data/public-cms";
import { PerspectiveCard } from "@/components/3d/PerspectiveCard";
import { WorkCinema } from "@/components/3d/WorkCinema";
import {
  CategoryFilter,
  buildCategoryOptions,
  matchesCategory,
} from "@/components/ui/CategoryFilter";
import { getVideoEmbed } from "@/lib/video";

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
  const [playing, setPlaying] = useState<PortfolioListItem | null>(null);

  const { categories, counts } = useMemo(
    () => buildCategoryOptions(projects, FALLBACK),
    [projects]
  );

  const filtered = useMemo(
    () => projects.filter((p) => matchesCategory(p.category, active)),
    [projects, active]
  );

  const featured =
    filtered.find((p) => p.is_featured) ?? filtered[0] ?? null;
  const rest = featured
    ? filtered.filter((p) => p.id !== featured.id)
    : filtered;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <CategoryFilter
          categories={categories}
          active={active}
          onChange={setActive}
          counts={counts}
        />
        <p className="shrink-0 text-[10px] uppercase tracking-[0.28em] text-muted pb-2">
          {filtered.length} {filtered.length === 1 ? "film" : "films"}
        </p>
      </div>

      {filtered.length > 0 && featured ? (
        <div className="work-stage">
          <div className="mb-5">
            <FeaturedCard
              project={featured}
              index={0}
              onPlay={() => setPlaying(featured)}
            />
          </div>

          {rest.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              {rest.map((project, i) => (
                <FeaturedCard
                  key={project.id}
                  project={project}
                  index={i + 1}
                  onPlay={
                    project.video_url ? () => setPlaying(project) : undefined
                  }
                />
              ))}
            </div>
          )}
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

      <WorkCinema item={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}

function FeaturedCard({
  project,
  index,
  onPlay,
  featured,
}: {
  project: PortfolioListItem;
  index: number;
  onPlay?: () => void;
  featured?: boolean;
}) {
  const embed = getVideoEmbed(project.video_url);
  const ytId = embed?.kind === "youtube" ? embed.id : null;
  const candidates =
    embed?.kind === "youtube" ? embed.posterCandidates : null;
  // Prefer YouTube official thumb; only use custom cover if set and non-empty
  const custom =
    project.cover_image_url && project.cover_image_url.trim()
      ? project.cover_image_url.trim()
      : null;

  return (
    <PerspectiveCard
      href={`/work/${project.slug}`}
      title={project.title}
      category={project.category}
      year={project.year}
      coverUrl={ytId ? null : custom}
      youtubeId={ytId}
      posterCandidates={candidates}
      hasVideo={Boolean(embed)}
      featured={featured ?? index === 0}
      index={index}
      onPlay={project.video_url ? onPlay : undefined}
    />
  );
}
