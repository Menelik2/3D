import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedFaqs } from "@/lib/data/public-cms";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about pricing, booking, production, delivery, revisions and more.",
};

const fallbackFaqs = [
  {
    q: "How do I book a project?",
    a: "Use the Start a Project form or book a consultation. We will review your brief and respond with next steps.",
  },
  {
    q: "Do you travel for productions?",
    a: "Yes. Travel and location details are discussed during the inquiry and proposal stage.",
  },
  {
    q: "What is included in a typical package?",
    a: "Packages vary by project type. Music videos, commercials and weddings each have different scopes — we outline inclusions in the proposal.",
  },
  {
    q: "How long does delivery take?",
    a: "Timelines depend on project complexity. A clear schedule is agreed before production begins.",
  },
  {
    q: "Can I request revisions?",
    a: "Yes. Revision rounds are defined in the production agreement.",
  },
  {
    q: "Who owns the final footage?",
    a: "Usage rights and ownership are specified in the contract. Client media rights are clear and documented.",
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
        <header className="mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
            FAQ
          </h1>
          <p className="mt-4 text-muted text-sm">
            Common questions about working with META Pictures.
          </p>
        </header>

        <div className="space-y-6">
          {faqs.map((item) => (
            <div key={item.q} className="border-b border-border pb-6">
              <h2 className="text-base font-light">{item.q}</h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        {cmsFaqs.length === 0 && (
          <p className="mt-12 text-sm text-muted">
            FAQs are managed in the admin dashboard. Additional questions can be
            added there.
          </p>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="text-xs uppercase tracking-widest text-accent hover:underline"
          >
            Still have questions? Contact us →
          </Link>
        </div>
      </div>
    </div>
  );
}
