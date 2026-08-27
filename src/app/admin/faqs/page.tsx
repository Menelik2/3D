import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PublishToggle } from "@/components/admin/PublishToggle";

export default async function AdminFaqsPage() {
  let faqs: Array<{ id: string; question: string; category: string | null; is_published: boolean }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("faqs").select("id, question, category, is_published").order("sort_order");
    faqs = data ?? [];
  } catch { /* ignore */ }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">FAQs</h1>
          <p className="mt-1 text-sm text-muted">Lightweight CMS for /faq</p>
        </div>
        <Link href="/admin/faqs/new" className="inline-flex bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover">
          + New FAQ
        </Link>
      </div>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted text-sm">
                  No FAQs. <Link href="/admin/faqs/new" className="text-accent hover:underline">Add one</Link>
                </td>
              </tr>
            ) : (
              faqs.map((f) => (
                <tr key={f.id} className="border-b border-border/60">
                  <td className="px-4 py-3 max-w-md truncate">{f.question}</td>
                  <td className="px-4 py-3 text-xs text-muted">{f.category || "—"}</td>
                  <td className="px-4 py-3">
                    <PublishToggle endpoint={`/api/cms/faqs/${f.id}`} initial={f.is_published} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/faqs/${f.id}`} className="text-[10px] uppercase tracking-widest text-muted hover:text-accent">Edit</Link>
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
