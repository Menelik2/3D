import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FaqForm } from "@/components/admin/FaqForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("faqs").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div>
          <Link href="/admin/faqs" className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground">← FAQs</Link>
          <h1 className="mt-3 text-2xl font-light tracking-tight">Edit FAQ</h1>
        </div>
        <DeleteButton endpoint={`/api/cms/faqs/${id}`} redirectTo="/admin/faqs" />
      </div>
      <FaqForm initial={data} />
    </div>
  );
}
