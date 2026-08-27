import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-light">Terms of Service</h1>
        <p className="mt-6 text-muted text-sm leading-relaxed">
          Placeholder terms. Replace with actual terms covering production agreements,
          usage rights, revisions, cancellation, payments, and intellectual property.
          Do not invent legal details.
        </p>
      </div>
    </div>
  );
}
