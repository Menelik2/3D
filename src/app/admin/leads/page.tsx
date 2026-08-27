import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
    const supabase = await createClient();
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
            Project inquiries. Click a row to update status and add notes.
          </p>
        </div>
        <p className="text-xs text-muted">{leads.length} shown</p>
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

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Types</th>
              <th className="px-4 py-3 font-medium">Budget</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-sm text-muted">
                  No leads yet. Submissions from{" "}
                  <Link href="/start-a-project" className="text-accent hover:underline">
                    Start a Project
                  </Link>{" "}
                  appear here after the schema is applied and keys are set.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-border/60 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link href={`/admin/leads/${lead.id}`} className="hover:text-accent">
                      {lead.reference_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="text-foreground/90 hover:text-accent">
                      {lead.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{lead.email}</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {lead.project_types?.slice(0, 2).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{lead.budget_range || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                      {lead.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(lead.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
