import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!item) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/projects"
            className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
          >
            ← Projects
          </Link>
          <h1 className="mt-3 text-2xl font-light tracking-tight">Edit: {item.title}</h1>
        </div>
        <DeleteButton endpoint={`/api/cms/projects/${id}`} redirectTo="/admin/projects" />
      </div>
      <ProjectForm initial={item} />
    </div>
  );
}
