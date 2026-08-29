import type { Metadata } from "next";
import { getPublicSiteConfig } from "@/lib/data/site-settings";
import { telLink, whatsappLink } from "@/lib/site-config";
import { ContactContent } from "@/components/pages/ContactContent";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with META Pictures. Start a project, book a consultation or send a message.",
};

export default async function ContactPage() {
  const { contact, social } = await getPublicSiteConfig();

  const channels = [
    contact.whatsapp
      ? { href: whatsappLink(contact.whatsapp), label: "WhatsApp", external: true }
      : null,
    contact.phone
      ? { href: telLink(contact.phone), label: contact.phone, external: false }
      : null,
    contact.email
      ? { href: `mailto:${contact.email}`, label: contact.email, external: false }
      : null,
    social.instagram
      ? { href: social.instagram, label: "Instagram", external: true }
      : null,
  ].filter(Boolean) as { href: string; label: string; external: boolean }[];

  return <ContactContent channels={channels} address={contact.address} />;
}
