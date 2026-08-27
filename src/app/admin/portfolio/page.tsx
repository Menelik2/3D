import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PublishToggle } from "@/components/admin/PublishToggle";

export default async function AdminPortfolioPage() {
  let items: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    year: number | null;
    is_published: boolean;
    is_featured: boolean;
  }> = [];
  let err: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("id, title, slug, category, year, is_published, is_featured")
      .order("sort_order", { ascending: true })
      .limit(100);
    if (error) err = error.message;
    else items = data ?? [];
  } catch {
    err = "Could not connect to Supabase.";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Portfolio CMS</h1>
          <p className="mt-1 text-sm text-muted">Create, publish, and feature work on /work.</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover"
        >
          + New project
        </Link>
      </div>

      {err && (
        <div className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">{err}</div>
      )}

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-sm text-muted">
                  No items.{" "}
                  <Link href="/admin/portfolio/new" className="text-accent hover:underline">
                    Create the first
                  </Link>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-border/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/portfolio/${item.id}`} className="hover:text-accent">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{item.category}</td>
                  <td className="px-4 py-3 text-xs text-muted">{item.year ?? "—"}</td>
                  <td className="px-4 py-3">
                    <PublishToggle
                      endpoint={`/api/cms/portfolio/${item.id}`}
                      field="is_published"
                      initial={item.is_published}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <PublishToggle
                      endpoint={`/api/cms/portfolio/${item.id}`}
                      field="is_featured"
                      initial={item.is_featured}
                      labels={["Featured", "—"]}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/portfolio/${item.id}`} className="text-[10px] uppercase tracking-widest text-muted hover:text-accent">
                      Edit
                    </Link>
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
