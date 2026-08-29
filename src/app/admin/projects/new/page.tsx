import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/projects"
          className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
        >
          ← Projects
        </Link>
        <h1 className="mt-3 text-2xl font-light tracking-tight">New project</h1>
        <p className="mt-1 text-sm text-muted">Internal production pipeline entry.</p>
      </div>
      <ProjectForm />
    </div>
  );
}
