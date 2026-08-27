import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedTeam } from "@/lib/data/public-cms";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBlock } from "@/components/ui/CtaBlock";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The creative team behind META Pictures — directors, cinematographers, editors and producers.",
};

export default async function TeamPage() {
  const members = await getPublishedTeam();

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Studio"
          title="Team"
          description="The people who turn ideas into frames — direction, camera, edit, and production."
        />

        {members.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <article
                key={m.id}
                className="group border border-border bg-card/20 overflow-hidden transition hover:border-accent/30"
              >
                <div className="aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                  {m.profile_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.profile_image_url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted/40 text-xs uppercase tracking-widest">
                      META
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                    {m.role}
                  </p>
                  <h2 className="mt-1 text-lg font-light tracking-tight">
                    {m.name}
                  </h2>
                  {m.bio && (
                    <p className="mt-3 text-sm text-muted line-clamp-3 leading-relaxed">
                      {m.bio}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-border bg-card/20 px-8 py-20 text-center">
            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
              Team profiles will appear here once published in the admin
              dashboard.
            </p>
            <Link href="/about" className="btn-ghost mt-8 inline-flex">
              About the studio
            </Link>
          </div>
        )}

        <CtaBlock />
      </div>
    </div>
  );
}
