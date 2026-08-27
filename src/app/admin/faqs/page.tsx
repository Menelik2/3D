import { createClient } from "@/lib/supabase/server";

export default async function AdminFaqsPage() {
  let faqs: Array<{ id: string; question: string; category: string | null; is_published: boolean }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("faqs")
      .select("id, question, category, is_published")
      .order("sort_order");
    faqs = data ?? [];
  } catch {
    /* ignore */
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-tight">FAQs</h1>
        <p className="mt-1 text-sm text-muted">Manage questions shown on /faq.</p>
      </div>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-muted text-sm">
                  No FAQs in database. Seed or add via Supabase Table Editor.
                </td>
              </tr>
            ) : (
              faqs.map((f) => (
                <tr key={f.id} className="border-b border-border/60">
                  <td className="px-4 py-3">{f.question}</td>
                  <td className="px-4 py-3 text-xs text-muted">{f.category || "—"}</td>
                  <td className="px-4 py-3 text-xs">{f.is_published ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
