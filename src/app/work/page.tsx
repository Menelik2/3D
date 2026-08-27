import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPortfolio } from "@/lib/data/public-cms";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected film and media projects by META Pictures — music videos, commercials, weddings, documentaries and more.",
};

const categories = [
  "All",
  "Music Videos",
  "Commercials",
  "Wedding Films",
  "Events",
  "Corporate Films",
  "Documentaries",
  "Photography",
  "Social Media Content",
];

export default async function WorkPage() {
  const projects = await getPublishedPortfolio();

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
            Work
          </h1>
          <p className="mt-4 text-muted max-w-xl text-sm sm:text-base">
            A selection of cinematic projects. Every frame tells a story.
          </p>
        </header>

        <div className="mb-12 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted hover:border-accent hover:text-foreground transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-card border border-border"
              >
                {project.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.cover_image_url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-zinc-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted">
                      {project.category}
                      {project.year ? ` · ${project.year}` : ""}
                    </p>
                    <h2 className="mt-1 text-lg font-light group-hover:text-accent transition-colors">
                      {project.title}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="relative block aspect-[4/5] overflow-hidden bg-card border border-border"
                >
                  <div className="absolute inset-0 bg-zinc-900" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted">
                        Coming soon
                      </p>
                      <h2 className="mt-1 text-lg font-light">Project {i + 1}</h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-16 text-center text-sm text-muted">
              Portfolio items are managed in the admin dashboard. Publish projects
              to show them here.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
