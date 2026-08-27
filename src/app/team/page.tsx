import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Team",
  description: "The creative team behind META Pictures — directors, cinematographers, editors and producers.",
};

export default function TeamPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">Team</h1>
          <p className="mt-4 text-muted text-sm sm:text-base">
            The people who turn ideas into frames. Team members are managed in the admin dashboard.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {["Director", "Cinematographer", "Editor", "Colorist", "Producer", "Photographer"].map((role) => (
            <div key={role} className="border border-border bg-card/30 p-8">
              <div className="aspect-square mb-6 bg-zinc-900 border border-border" />
              <p className="text-xs uppercase tracking-widest text-muted">{role}</p>
              <h2 className="mt-1 text-lg font-light">—</h2>
              <p className="mt-3 text-sm text-muted">Add team member via CMS</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/start-a-project" className="inline-flex bg-accent px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-accent-hover">
            Start a Project
          </Link>
        </div>
      </div>
    </div>
  );
}
