import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedJournal } from "@/lib/data/public-cms";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Production journal — cinematography, behind the scenes, creative direction and META Pictures news.",
};

const categories = [
  "All",
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

export default async function JournalPage() {
  const posts = await getPublishedJournal();

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
            Journal
          </h1>
          <p className="mt-4 text-muted text-sm sm:text-base">
            Notes from set, process and craft.
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

        {posts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group border border-border bg-card/20 overflow-hidden"
              >
                <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
                  {post.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image_url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-widest text-muted">
                    {[post.category, formatDate(post.published_at)]
                      .filter(Boolean)
                      .join(" · ") || "Journal"}
                  </p>
                  <h2 className="mt-2 text-lg font-light group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-muted line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <article
                  key={i}
                  className="group border border-border bg-card/20 overflow-hidden"
                >
                  <div className="aspect-[16/10] bg-zinc-900" />
                  <div className="p-6">
                    <p className="text-[10px] uppercase tracking-widest text-muted">
                      Category · Date
                    </p>
                    <h2 className="mt-2 text-lg font-light">
                      Journal Entry Placeholder {i}
                    </h2>
                    <p className="mt-2 text-sm text-muted line-clamp-2">
                      Short excerpt will appear here when posts are published
                      from the CMS.
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-16 text-center text-sm text-muted">
              No published posts yet. Add journal entries in the admin dashboard.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
