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
      .select(
        "id, consultation_type, full_name, email, status, preferred_date, created_at"
      )
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
          Booking requests from /book-consultation. Open a row to update status.
        </p>
      </div>

      {err && (
        <div className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          {err}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="border border-border px-4 py-16 text-center text-sm text-muted">
          No consultations yet.{" "}
          <Link href="/book-consultation" className="text-accent hover:underline">
            Book form
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {rows.map((r) => (
              <Link
                key={r.id}
                href={`/admin/consultations/${r.id}`}
                className="block border border-border bg-card/20 p-4 hover:border-accent/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground/95 break-words">
                    {r.full_name}
                  </p>
                  <span className="shrink-0 border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                    {r.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{r.consultation_type}</p>
                <p className="mt-1 text-xs text-muted break-all">{r.email}</p>
                <div className="mt-2 flex flex-wrap gap-x-3 text-[11px] text-muted">
                  {r.preferred_date ? <span>Pref: {r.preferred_date}</span> : null}
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto border border-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Preferred date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Requested</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border/60 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">{r.consultation_type}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/consultations/${r.id}`}
                        className="hover:text-accent"
                      >
                        {r.full_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{r.email}</td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {r.preferred_date || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                        {r.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/consultations/${r.id}`}
                        className="text-[10px] uppercase tracking-widest text-muted hover:text-accent"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
