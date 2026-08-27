import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How META Pictures handles information submitted through this website.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Legal"
          title="Privacy Policy"
          description="This page summarizes how information submitted through the META Pictures website is typically handled. Replace with counsel-approved text before public launch if required in your jurisdiction."
        />

        <div className="space-y-10 text-sm text-muted leading-relaxed">
          <section>
            <h2 className="text-foreground font-light text-base mb-3">
              Information you provide
            </h2>
            <p>
              When you use Start a Project, Book a Consultation, or Contact
              channels, you may share name, email, phone, project details, and
              related notes. That information is used to respond to your inquiry
              and manage production discussions.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-light text-base mb-3">
              How we use it
            </h2>
            <p>
              Inquiry data is stored in our production systems (including our
              database provider) so the studio can review leads, schedule
              consultations, and follow up. We do not sell your personal
              information.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-light text-base mb-3">
              Cookies & analytics
            </h2>
            <p>
              The site may use essential cookies for session and security. If
              analytics tools are added later, this section should be updated to
              name them and explain opt-out options.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-light text-base mb-3">
              Contact
            </h2>
            <p>
              For privacy-related requests, use the{" "}
              <Link href="/contact" className="text-foreground hover:text-accent transition-colors">
                contact page
              </Link>{" "}
              or the email published in site settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
