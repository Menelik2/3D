import type { Metadata } from "next";
import { getPublishedJournal } from "@/lib/data/public-cms";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBlock } from "@/components/ui/CtaBlock";
import { JournalFilterGrid } from "@/components/JournalFilterGrid";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Production journal — cinematography, behind the scenes, creative direction and META Pictures news.",
};

export default async function JournalPage() {
  const posts = await getPublishedJournal();

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Notes from set"
          title="Journal"
          description="Cinematography, process, and stories from META Pictures productions."
        />

        {posts.length > 0 ? (
          <JournalFilterGrid posts={posts} />
        ) : (
          <div className="border border-border bg-card/20 px-8 py-20 text-center">
            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
              Journal entries will appear here once published from the studio
              dashboard.
            </p>
          </div>
        )}

        <CtaBlock />
      </div>
    </div>
  );
}
