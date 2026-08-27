import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "General terms for using the META Pictures website and submitting project inquiries.",
};

export default function TermsPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Legal"
          title="Terms of Service"
          description="General conditions for using this website. Production agreements, usage rights, and payments are defined in separate written contracts."
        />

        <div className="space-y-10 text-sm text-muted leading-relaxed">
          <section>
            <h2 className="text-foreground font-light text-base mb-3">
              Website use
            </h2>
            <p>
              Content on this site (text, images, video embeds, branding) is
              provided for information about META Pictures services. You may not
              copy or redistribute studio materials without permission.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-light text-base mb-3">
              Project inquiries
            </h2>
            <p>
              Submitting a form does not create a production contract. Booking,
              schedules, fees, revisions, and deliverables are confirmed only in
              a written agreement between you and META Pictures.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-light text-base mb-3">
              Intellectual property
            </h2>
            <p>
              Ownership and license terms for finished films and stills are set
              in the production agreement for each project.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-light text-base mb-3">
              Questions
            </h2>
            <p>
              For commercial terms, reach us via{" "}
              <Link href="/contact" className="text-foreground hover:text-accent transition-colors">
                contact
              </Link>{" "}
              or{" "}
              <Link href="/start-a-project" className="text-foreground hover:text-accent transition-colors">
                start a project
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
