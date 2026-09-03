import Link from "next/link";
import { LeadForm } from "@/components/admin/LeadForm";

export default function NewLeadPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/leads"
          className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
        >
          ← All leads
        </Link>
        <h1 className="mt-3 text-2xl font-light tracking-tight">New lead</h1>
        <p className="mt-1 text-sm text-muted">
          Manually add a project inquiry (phone / referral / walk-in).
        </p>
      </div>
      <LeadForm />
    </div>
  );
}
