import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TeamForm } from "@/components/admin/TeamForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("team_members").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div>
          <Link href="/admin/team" className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground">← Team</Link>
          <h1 className="mt-3 text-2xl font-light tracking-tight">Edit: {data.name}</h1>
        </div>
        <DeleteButton endpoint={`/api/cms/team/${id}`} redirectTo="/admin/team" />
      </div>
      <TeamForm initial={data} />
    </div>
  );
}
