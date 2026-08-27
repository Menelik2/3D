import { createClient } from "@/lib/supabase/server";

export default async function AdminProjectsPage() {
  let rows: Array<{
    id: string;
    title: string;
    status: string;
    category: string | null;
    production_date: string | null;
    budget: number | null;
  }> = [];
  let err: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, status, category, production_date, budget")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) err = error.message;
    else rows = data ?? [];
  } catch {
    err = "Could not connect to Supabase.";
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-muted">
          Internal production projects (IDEA → FINAL DELIVERY).
        </p>
      </div>

      {err && (
        <div className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          {err}
        </div>
      )}

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Production</th>
              <th className="px-4 py-3 font-medium">Budget</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-sm text-muted">
                  No internal projects yet. Convert a confirmed lead into a project from the leads
                  pipeline (coming next).
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3 text-muted text-xs">{r.category || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                      {r.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{r.production_date || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {r.budget != null ? r.budget.toLocaleString() : "—"}
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
