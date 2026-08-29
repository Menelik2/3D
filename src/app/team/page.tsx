import type { Metadata } from "next";
import { getPublishedTeam } from "@/lib/data/public-cms";
import { TeamContent } from "@/components/pages/TeamContent";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team",
  description: "The META Pictures creative team.",
};

export default async function TeamPage() {
  const team = await getPublishedTeam();
  return <TeamContent team={team} />;
}
