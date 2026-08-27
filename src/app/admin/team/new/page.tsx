import Link from "next/link";
import { TeamForm } from "@/components/admin/TeamForm";

export default function NewTeamPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/team" className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground">← Team</Link>
        <h1 className="mt-3 text-2xl font-light tracking-tight">Add team member</h1>
      </div>
      <TeamForm />
    </div>
  );
}
