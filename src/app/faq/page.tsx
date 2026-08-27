import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedFaqs } from "@/lib/data/public-cms";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about pricing, booking, production, delivery, revisions and more.",
};

const fallbackFaqs = [
  {
    q: "How do I book a project?",
    a: "Use the Start a Project form or book a consultation. We review your brief and respond with next steps and a clear proposal.",
  },
  {
    q: "Do you travel for productions?",
    a: "Yes. Travel and location details are confirmed during the inquiry and proposal stage.",
  },
  {
    q: "What is included in a typical package?",
    a: "Packages vary by project type. Music videos, commercials, and weddings each have different scopes — inclusions are listed in the proposal.",
  },
  {
    q: "How long does delivery take?",
    a: "Timelines depend on complexity. A production schedule is agreed before cameras roll.",
  },
  {
    q: "Can I request revisions?",
    a: "Yes. Revision rounds are defined in the production agreement so expectations stay clear.",
  },
  {
    q: "Who owns the final footage?",
    a: "Usage rights and ownership are specified in the contract. Client media rights are documented before delivery.",
  },
];

export default async function FAQPage() {
  const cmsFaqs = await getPublishedFaqs();
  const faqs =
    cmsFaqs.length > 0
      ? cmsFaqs.map((f) => ({ q: f.question, a: f.answer }))
      : fallbackFaqs;

  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Support"
          title="FAQ"
          description="Common questions about working with META Pictures."
        />

        <div className="space-y-0 border-t border-border">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="border-b border-border py-7 first:pt-8"
            >
              <h2 className="text-base sm:text-lg font-light tracking-tight">
                {item.q}
              </h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 border border-border bg-card/20 p-8 text-center">
          <p className="text-sm text-muted">Still have questions?</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/contact" className="btn-ghost min-w-[160px]">
              Contact
            </Link>
            <Link href="/start-a-project" className="btn-primary min-w-[160px]">
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
