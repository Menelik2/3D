import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
          <h1 className="text-2xl font-light tracking-tight">Portfolio</h1>
          <p className="mt-1 text-sm text-muted">
            Public work shown on /work. Create and publish items in Supabase or via future editor.
          </p>
        </div>
        <Link
          href="/work"
          className="text-xs uppercase tracking-widest text-muted hover:text-foreground"
        >
          View public page →
        </Link>
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
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Featured</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-sm text-muted">
                  No portfolio items. Insert rows into <code className="text-foreground/80">portfolio_items</code>{" "}
                  (or use Table Editor in Supabase) with <code className="text-foreground/80">is_published = true</code>.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-border/60">
                  <td className="px-4 py-3">
                    <Link href={`/work/${item.slug}`} className="hover:text-accent">
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{item.category}</td>
                  <td className="px-4 py-3 text-xs text-muted">{item.year ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    {item.is_published ? (
                      <span className="text-emerald-500/90">Yes</span>
                    ) : (
                      <span className="text-muted">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{item.is_featured ? "Yes" : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
