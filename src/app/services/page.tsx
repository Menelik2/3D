import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CtaBlock } from "@/components/ui/CtaBlock";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Music videos, commercial films, wedding films, event production, corporate films, documentaries, social media content and photography by META Pictures.",
};

const services = [
  {
    title: "Music Videos",
    description:
      "Concept, cinematography, direction, production, edit, grade, and delivery — built for artists who need a strong visual identity.",
  },
  {
    title: "Commercial Films",
    description:
      "Brand and product films with cinematic craft and clear messaging for businesses and organizations.",
  },
  {
    title: "Wedding Films",
    description:
      "Emotion-first wedding storytelling — not just coverage, but a film you’ll revisit for decades.",
  },
  {
    title: "Event Production",
    description:
      "Professional multi-camera video and photography for conferences, launches, and live moments.",
  },
  {
    title: "Corporate Films",
    description:
      "Brand stories, leadership interviews, culture films, and internal communication pieces.",
  },
  {
    title: "Documentaries",
    description:
      "Long-form and short documentary work rooted in authenticity and careful editorial structure.",
  },
  {
    title: "Social Media Content",
    description:
      "Short-form cinematic content for Instagram, TikTok, YouTube Shorts, and campaign cutdowns.",
  },
  {
    title: "Photography",
    description:
      "Commercial, portrait, event, and creative stills that match the tone of your moving image.",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Capabilities"
          title="Services"
          description="From first concept to final delivery — cinematic production for brands, artists, and real stories."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group border border-border bg-card/20 p-8 md:p-10 transition duration-300 hover:border-accent/35 hover:bg-card/40"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[10px] text-muted/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-1 w-1 rounded-full bg-accent/0 group-hover:bg-accent transition-colors mt-1.5" />
              </div>
              <h2 className="mt-4 text-xl font-light tracking-tight group-hover:text-accent transition-colors">
                {service.title}
              </h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <Link href="/work" className="btn-ghost">
            View work
          </Link>
          <Link href="/start-a-project" className="btn-primary">
            Start a project
          </Link>
        </div>

        <CtaBlock title="Not sure which service fits?" description="Tell us about your idea — we’ll recommend the right format and production path." />
      </div>
    </div>
  );
}
