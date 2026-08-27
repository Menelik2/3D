import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminConsultationsPage() {
  let rows: Array<{
    id: string;
    consultation_type: string;
    full_name: string;
    email: string;
    status: string;
    preferred_date: string | null;
    created_at: string;
  }> = [];
  let err: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("consultations")
      .select("id, consultation_type, full_name, email, status, preferred_date, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) err = error.message;
    else rows = data ?? [];
  } catch {
    err = "Could not connect to Supabase.";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-tight">Consultations</h1>
        <p className="mt-1 text-sm text-muted">
          Booking requests from /book-consultation.
        </p>
      </div>

      {err && (
        <div className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          {err}
        </div>
      )}

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Preferred date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Requested</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-sm text-muted">
                  No consultations yet.{" "}
                  <Link href="/book-consultation" className="text-accent hover:underline">
                    Book form
                  </Link>
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="px-4 py-3">{r.consultation_type}</td>
                  <td className="px-4 py-3">{r.full_name}</td>
                  <td className="px-4 py-3 text-xs text-muted">{r.email}</td>
                  <td className="px-4 py-3 text-xs text-muted">{r.preferred_date || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString()}
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
