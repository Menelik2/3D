import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Music videos, commercial films, wedding films, event production, corporate films, documentaries, social media content and photography by META Pictures.",
};

const services = [
  {
    title: "Music Videos",
    slug: "music-videos",
    description: "Concept development, cinematography, directing, production, editing, color grading and delivery.",
  },
  {
    title: "Commercial Films",
    slug: "commercial-films",
    description: "Creative advertising films for businesses, brands and organizations.",
  },
  {
    title: "Wedding Films",
    slug: "wedding-films",
    description: "Cinematic wedding storytelling that captures emotion and memory.",
  },
  {
    title: "Event Production",
    slug: "event-production",
    description: "Professional event video and photography coverage.",
  },
  {
    title: "Corporate Films",
    slug: "corporate-films",
    description: "Brand stories, interviews, promotional films and corporate communication.",
  },
  {
    title: "Documentaries",
    slug: "documentaries",
    description: "Authentic storytelling and documentary production.",
  },
  {
    title: "Social Media Content",
    slug: "social-media-content",
    description: "Short-form cinematic content for Instagram, TikTok, YouTube Shorts and more.",
  },
  {
    title: "Photography",
    slug: "photography",
    description: "Professional commercial, portrait, event and creative photography.",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
            Services
          </h1>
          <p className="mt-4 text-muted text-sm sm:text-base">
            We transform ideas, people, brands, music, events and real stories into cinematic visual experiences.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group border border-border bg-card/30 p-8 transition hover:border-accent/40"
            >
              <h2 className="text-xl font-light group-hover:text-accent transition-colors">
                {service.title}
              </h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                {service.description}
              </p>
              <span className="mt-6 inline-block text-xs uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
                Learn more →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/start-a-project"
            className="inline-flex items-center justify-center bg-accent px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-white hover:bg-accent-hover"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </div>
  );
}
