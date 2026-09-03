import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JournalForm } from "@/components/admin/JournalForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function EditJournalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) notFound();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/journal"
            className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
          >
            ← Journal
          </Link>
          <h1 className="mt-3 text-2xl font-light tracking-tight">
            Edit: {data.title}
          </h1>
          <p className="mt-1 font-mono text-xs text-muted">/{data.slug}</p>
        </div>
        <DeleteButton
          endpoint={`/api/cms/journal/${id}`}
          redirectTo="/admin/journal"
        />
      </div>
      <JournalForm initial={data} />
    </div>
  );
}
