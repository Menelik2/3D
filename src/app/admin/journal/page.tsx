import { createClient } from "@/lib/supabase/server";

export default async function AdminJournalPage() {
  let posts: Array<{ id: string; title: string; slug: string; is_published: boolean; category: string | null }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("journal_posts")
      .select("id, title, slug, is_published, category")
      .order("created_at", { ascending: false });
    posts = data ?? [];
  } catch {
    /* ignore */
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-tight">Journal</h1>
        <p className="mt-1 text-sm text-muted">CMS posts for /journal.</p>
      </div>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-muted text-sm">
                  No posts. Add rows to <code className="text-foreground/80">journal_posts</code>.
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="border-b border-border/60">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 text-muted text-xs">{p.category || "—"}</td>
                  <td className="px-4 py-3 text-xs">{p.is_published ? "Published" : "Draft"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
