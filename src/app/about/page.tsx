import type { Metadata } from "next";
import { getPublishedTeam } from "@/lib/data/public-cms";
import { AboutContent } from "@/components/pages/AboutContent";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "META Pictures — a creative film and media production company. We transform ideas into visual stories that people remember.",
};

export default async function AboutPage() {
  const team = await getPublishedTeam();
  return <AboutContent team={team} />;
}
