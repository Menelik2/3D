import type { Metadata } from "next";
import { ServicesContent } from "@/components/pages/ServicesContent";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Music videos, commercial films, wedding films, event production, corporate films, documentaries, social media content and photography by META Pictures.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
