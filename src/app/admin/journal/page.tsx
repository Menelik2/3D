import Link from "next/link";
import { getCmsClient } from "@/lib/cms";
import { JournalTable } from "@/components/admin/JournalTable";

export default async function AdminJournalPage() {
  let posts: Array<{
    id: string;
    title: string;
    slug: string;
    is_published: boolean;
    category: string | null;
    published_at: string | null;
    created_at: string;
  }> = [];
  let errorMsg: string | null = null;

  try {
    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("journal_posts")
      .select(
        "id, title, slug, is_published, category, published_at, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) errorMsg = error.message;
    else posts = data ?? [];
  } catch {
    errorMsg = "Could not load journal posts. Check Supabase keys.";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Journal CMS</h1>
          <p className="mt-1 text-sm text-muted">
            Posts for /journal. Create, edit, publish, or permanently delete.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-muted">{posts.length} posts</p>
          <Link
            href="/admin/journal/new"
            className="inline-flex bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover"
          >
            + New post
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          {errorMsg}
        </div>
      )}

      <JournalTable posts={posts} />
    </div>
  );
}
