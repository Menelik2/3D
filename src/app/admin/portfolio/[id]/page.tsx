import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

type Props = { params: Promise<{ id: string }> };

export default async function EditPortfolioPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase.from("portfolio_items").select("*").eq("id", id).single();
  if (!item) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/portfolio" className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground">
            ← Portfolio
          </Link>
          <h1 className="mt-3 text-2xl font-light tracking-tight">Edit: {item.title}</h1>
        </div>
        <DeleteButton endpoint={`/api/cms/portfolio/${id}`} redirectTo="/admin/portfolio" />
      </div>
      <PortfolioForm initial={item} />
    </div>
  );
}
