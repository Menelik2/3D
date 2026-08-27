import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="pt-24 md:pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-light">Privacy Policy</h1>
        <p className="mt-6 text-muted text-sm leading-relaxed">
          Placeholder privacy policy. Replace with actual legal text covering data collection,
          cookies, inquiries, client portal data, and contact information. Do not invent
          legal registrations or company details.
        </p>
      </div>
    </div>
  );
}
