import type { Metadata } from "next";
import { getPublishedPortfolio } from "@/lib/data/public-cms";
import { WorkContent } from "@/components/pages/WorkContent";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected film and media projects by META Pictures — music videos, commercials, weddings, documentaries and more.",
};

export default async function WorkPage() {
  const projects = await getPublishedPortfolio();
  return <WorkContent projects={projects} />;
}
