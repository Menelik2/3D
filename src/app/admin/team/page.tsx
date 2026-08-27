import { createClient } from "@/lib/supabase/server";

export default async function AdminTeamPage() {
  let members: Array<{ id: string; name: string; role: string; is_published: boolean }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("team_members")
      .select("id, name, role, is_published")
      .order("sort_order");
    members = data ?? [];
  } catch {
    /* ignore */
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-tight">Team</h1>
        <p className="mt-1 text-sm text-muted">
          Team members shown on /team when published. Manage via Supabase Table Editor for now.
        </p>
      </div>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-muted text-sm">
                  No team members. Insert into <code className="text-foreground/80">team_members</code>.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="border-b border-border/60">
                  <td className="px-4 py-3">{m.name}</td>
                  <td className="px-4 py-3 text-muted">{m.role}</td>
                  <td className="px-4 py-3 text-xs">{m.is_published ? "Yes" : "Draft"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
