import type { Metadata } from "next";
import { getPublicSiteConfig } from "@/lib/data/site-settings";
import { ContactContent } from "@/components/pages/ContactContent";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with META Pictures.",
};

export default async function ContactPage() {
  const { contact, social } = await getPublicSiteConfig();
  return <ContactContent contact={contact} social={social} />;
}
