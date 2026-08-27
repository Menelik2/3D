import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Behind the Scenes",
  description:
    "Camera setups, lighting, editing, color grading and crew moments from META Pictures productions.",
};

const topics = [
  { label: "Camera setup", hint: "Lenses · framing · movement" },
  { label: "Lighting", hint: "Natural · practical · designed" },
  { label: "On set", hint: "Crew · talent · atmosphere" },
  { label: "Editing", hint: "Pace · story · sound" },
  { label: "Color grade", hint: "Tone · contrast · look" },
  { label: "Crew", hint: "Collaboration behind the frame" },
];

export default function BTSPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Process"
          title="Behind the Scenes"
          description="How frames are built — setups, light, edit, and the people who make it happen. Gallery content can be published from the studio CMS."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((item) => (
            <div
              key={item.label}
              className="group relative aspect-[4/5] overflow-hidden border border-border bg-card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
                    BTS
                  </p>
                  <h2 className="mt-1 text-lg font-light tracking-tight group-hover:text-accent transition-colors">
                    {item.label}
                  </h2>
                  <p className="mt-1 text-xs text-muted/70">{item.hint}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/work" className="btn-ghost">
            View finished work
          </Link>
          <Link href="/journal" className="btn-primary">
            Read the journal
          </Link>
        </div>
      </div>
    </div>
  );
}
