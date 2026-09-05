import Link from "next/link";
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
      .limit(100);
    if (error) err = error.message;
    else rows = data ?? [];
  } catch {
    err = "Could not connect to Supabase.";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            Internal production projects (IDEA → FINAL DELIVERY).
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary self-start">
          + New project
        </Link>
      </div>

      {err && (
        <div className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          {err}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="border border-border px-4 py-16 text-center text-sm text-muted">
          No projects yet.{" "}
          <Link href="/admin/projects/new" className="text-accent hover:underline">
            Create one
          </Link>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-2">
            {rows.map((row) => (
              <Link
                key={row.id}
                href={`/admin/projects/${row.id}`}
                className="block border border-border bg-card/20 p-4 hover:border-accent/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium break-words">{row.title}</p>
                  <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted">
                    {row.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 text-[11px] text-muted">
                  {row.category ? <span>{row.category}</span> : null}
                  {row.production_date ? <span>{row.production_date}</span> : null}
                  {row.budget != null ? (
                    <span>{Number(row.budget).toLocaleString()}</span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Production</th>
                  <th className="px-4 py-3 font-medium">Budget</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/60 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${row.id}`}
                        className="hover:text-accent"
                      >
                        {row.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {row.category || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs uppercase tracking-wider text-muted">
                      {row.status.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {row.production_date || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {row.budget != null
                        ? Number(row.budget).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/projects/${row.id}`}
                        className="text-[10px] uppercase tracking-widest text-muted hover:text-accent"
                      >
                        Edit
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
