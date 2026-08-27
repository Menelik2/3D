import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Behind the Scenes",
  description: "Camera setups, lighting, editing, color grading and crew moments from META Pictures productions.",
};

export default function BTSPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
            Behind the Scenes
          </h1>
          <p className="mt-4 text-muted text-sm sm:text-base">
            Process, setups and moments from production. Content is managed in the CMS.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["Camera Setup", "Lighting", "On Set", "Editing", "Color Grade", "Crew"].map((label) => (
            <div key={label} className="group relative aspect-[4/5] overflow-hidden border border-border bg-card">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted">BTS</p>
                  <h2 className="mt-1 text-lg font-light">{label}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/work" className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors">
            View finished work →
          </Link>
        </div>
      </div>
    </div>
  );
}
