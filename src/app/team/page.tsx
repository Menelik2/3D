import type { Metadata } from "next";
import { getPublishedTeam } from "@/lib/data/public-cms";
import { TeamContent } from "@/components/pages/TeamContent";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The creative team behind META Pictures — directors, cinematographers, editors and producers.",
};

export default async function TeamPage() {
  const members = await getPublishedTeam();
  return <TeamContent members={members} />;
}
