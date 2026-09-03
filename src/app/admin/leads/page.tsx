import Link from "next/link";
import { getCmsClient } from "@/lib/cms";
import { LeadsTable } from "@/components/admin/LeadsTable";

const STATUSES = [
  "NEW",
  "CONTACTED",
  "CONSULTATION_SCHEDULED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "CONFIRMED",
  "IN_PRODUCTION",
  "COMPLETED",
  "CANCELLED",
  "ARCHIVED",
];

export default async function AdminLeadsPage() {
  let leads: Array<{
    id: string;
    reference_number: string;
    full_name: string;
    email: string;
    status: string;
    project_types: string[] | null;
    budget_range: string | null;
    created_at: string;
  }> = [];
  let errorMsg: string | null = null;

  try {
    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("leads")
      .select(
        "id, reference_number, full_name, email, status, project_types, budget_range, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) errorMsg = error.message;
    else leads = data ?? [];
  } catch {
    errorMsg = "Could not connect to Supabase. Check .env.local keys.";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted">
            Project inquiries. Select rows to bulk-delete permanently from the database.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-muted">{leads.length} shown</p>
          <Link
            href="/admin/leads/new"
            className="bg-accent px-4 py-2.5 text-[10px] uppercase tracking-widest text-white hover:bg-accent-hover"
          >
            New lead
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <span
            key={s}
            className="border border-border px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted"
          >
            {s.replace(/_/g, " ")}
          </span>
        ))}
      </div>

      {errorMsg && (
        <div className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          {errorMsg}
        </div>
      )}

      <LeadsTable leads={leads} />
    </div>
  );
}
