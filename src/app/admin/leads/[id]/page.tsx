import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeadStatusForm } from "@/components/admin/LeadStatusForm";
import { LeadNotesPanel } from "@/components/admin/LeadNotesPanel";
import { LeadForm } from "@/components/admin/LeadForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

type Props = { params: Promise<{ id: string }> };

export default async function AdminLeadDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !lead) {
    notFound();
  }

  const { data: notes } = await supabase
    .from("lead_notes")
    .select("id, body, created_at")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/leads"
            className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
          >
            ← All leads
          </Link>
          <h1 className="mt-3 text-2xl font-light tracking-tight">{lead.full_name}</h1>
          <p className="mt-1 font-mono text-xs text-muted">{lead.reference_number}</p>
        </div>
        <div className="flex items-center gap-4 self-start">
          <span className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted">
            {String(lead.status).replace(/_/g, " ")}
          </span>
          <DeleteButton
            endpoint={`/api/admin/leads/${id}`}
            redirectTo="/admin/leads"
          />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section className="border border-border bg-card/20 p-6 space-y-4 text-sm">
            <h2 className="text-xs uppercase tracking-widest text-muted">Contact</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-muted">Email</dt>
                <dd className="mt-1">{lead.email}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-muted">Phone</dt>
                <dd className="mt-1">{lead.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-muted">WhatsApp</dt>
                <dd className="mt-1">{lead.whatsapp || "—"}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-muted">Company</dt>
                <dd className="mt-1">{lead.company || "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="border border-border bg-card/20 p-6 space-y-4 text-sm">
            <h2 className="text-xs uppercase tracking-widest text-muted">Project</h2>
            <p>
              <span className="text-muted text-xs">Types: </span>
              {(lead.project_types as string[] | null)?.join(", ") || "—"}
            </p>
            <p>
              <span className="text-muted text-xs">Title: </span>
              {lead.project_title || "—"}
            </p>
            <p className="whitespace-pre-wrap">
              <span className="text-muted text-xs block mb-1">Description</span>
              {lead.project_description || "—"}
            </p>
            <p className="whitespace-pre-wrap">
              <span className="text-muted text-xs block mb-1">Creative idea</span>
              {lead.creative_idea || "—"}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              <p>
                <span className="text-muted text-xs">Budget: </span>
                {lead.budget_range || "—"}
              </p>
              <p>
                <span className="text-muted text-xs">City: </span>
                {lead.city || "—"}
              </p>
              <p>
                <span className="text-muted text-xs">Preferred date: </span>
                {lead.preferred_date || "—"}
              </p>
              <p>
                <span className="text-muted text-xs">Location: </span>
                {lead.location || "—"}
              </p>
            </div>
          </section>

          <section className="border border-border bg-card/20 p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted mb-4">Notes</h2>
            <LeadNotesPanel leadId={lead.id} initialNotes={notes ?? []} />
          </section>

          <section className="border border-border bg-card/20 p-6">
            <h2 className="text-xs uppercase tracking-widest text-muted mb-6">Edit lead</h2>
            <LeadForm initial={lead} />
          </section>
        </div>

        <aside className="space-y-6">
          <div className="border border-border bg-card/30 p-6">
            <LeadStatusForm leadId={lead.id} initialStatus={lead.status} />
          </div>
          <div className="border border-border bg-card/20 p-6 text-xs text-muted space-y-2">
            <p>Created: {new Date(lead.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(lead.updated_at).toLocaleString()}</p>
            <p>Source: {lead.source || "website"}</p>
            {lead.estimated_budget != null && (
              <p>Est. budget: {Number(lead.estimated_budget).toLocaleString()}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
