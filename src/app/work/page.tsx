import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPortfolio } from "@/lib/data/public-cms";
import { PageHeader } from "@/components/ui/PageHeader";
import { PerspectiveCard } from "@/components/3d/PerspectiveCard";
import { CtaBlock } from "@/components/ui/CtaBlock";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected film and media projects by META Pictures — music videos, commercials, weddings, documentaries and more.",
};

export default async function WorkPage() {
  const projects = await getPublishedPortfolio();

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Portfolio"
          title="Work"
          description="Selected cinematic projects across music, brand, wedding, and documentary. Every frame tells a story."
        />

        {projects.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
            {projects.map((project) => (
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
          <div className="border border-border bg-card/20 px-8 py-20 text-center">
            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
              New work is publishing soon. Projects appear here once they are
              marked published in the studio dashboard.
            </p>
            <Link href="/start-a-project" className="btn-primary mt-8 inline-flex">
              Commission a project
            </Link>
          </div>
        )}

        <CtaBlock />
      </div>
    </div>
  );
}
