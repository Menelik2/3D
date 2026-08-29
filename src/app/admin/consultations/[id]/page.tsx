import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ConsultationStatusForm } from "@/components/admin/ConsultationStatusForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

type Props = { params: Promise<{ id: string }> };

export default async function ConsultationDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: row } = await supabase.from("consultations").select("*").eq("id", id).single();
  if (!row) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/consultations"
            className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
          >
            ← Consultations
          </Link>
          <h1 className="mt-3 text-2xl font-light tracking-tight">{row.full_name}</h1>
          <p className="mt-1 text-sm text-muted">
            {row.consultation_type} · {row.email}
          </p>
        </div>
        <DeleteButton
          endpoint={`/api/cms/consultations/${id}`}
          redirectTo="/admin/consultations"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 border border-border bg-card/40 p-5 text-sm">
          <Row label="Status" value={String(row.status).replace(/_/g, " ")} />
          <Row label="Phone" value={row.phone || "—"} />
          <Row label="Preferred date" value={row.preferred_date || "—"} />
          <Row label="Preferred time" value={row.preferred_time || "—"} />
          <Row label="Duration" value={`${row.duration_minutes ?? 30} min`} />
          <Row label="Location" value={row.meeting_location || "—"} />
          <Row label="Meeting URL" value={row.online_meeting_url || "—"} />
          <Row
            label="Created"
            value={row.created_at ? new Date(row.created_at).toLocaleString() : "—"}
          />
          {row.notes && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Notes</p>
              <p className="mt-1 whitespace-pre-wrap text-muted">{row.notes}</p>
            </div>
          )}
        </div>
        <div>
          <h2 className="mb-4 text-xs uppercase tracking-widest text-muted">Update</h2>
          <ConsultationStatusForm
            id={id}
            initialStatus={row.status}
            initialNotes={row.notes}
          />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/50 py-2">
      <span className="text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <span className="text-right text-foreground/90">{value}</span>
    </div>
  );
}
