import type { Metadata } from "next";
import { getPublishedFaqs } from "@/lib/data/public-cms";
import { FaqContent } from "@/components/pages/FaqContent";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about pricing, booking, production, delivery, revisions and more.",
};

export default async function FAQPage() {
  const cmsFaqs = await getPublishedFaqs();
  const mapped = cmsFaqs.map((f) => ({ q: f.question, a: f.answer }));
  return <FaqContent cmsFaqs={mapped} />;
}
