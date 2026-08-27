import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PublishToggle } from "@/components/admin/PublishToggle";

export default async function AdminJournalPage() {
  let posts: Array<{ id: string; title: string; slug: string; is_published: boolean; category: string | null }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("journal_posts").select("id, title, slug, is_published, category").order("created_at", { ascending: false });
    posts = data ?? [];
  } catch { /* ignore */ }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Journal CMS</h1>
          <p className="mt-1 text-sm text-muted">Posts for /journal</p>
        </div>
        <Link href="/admin/journal/new" className="inline-flex bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover">
          + New post
        </Link>
      </div>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted text-sm">
                  No posts. <Link href="/admin/journal/new" className="text-accent hover:underline">Write one</Link>
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="border-b border-border/60">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 text-muted text-xs">{p.category || "—"}</td>
                  <td className="px-4 py-3">
                    <PublishToggle endpoint={`/api/cms/journal/${p.id}`} initial={p.is_published} labels={["Published", "Draft"]} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/journal/${p.id}`} className="text-[10px] uppercase tracking-widest text-muted hover:text-accent">Edit</Link>
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
