import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PublishToggle } from "@/components/admin/PublishToggle";

export default async function AdminTeamPage() {
  let members: Array<{
    id: string;
    name: string;
    role: string;
    is_published: boolean;
  }> = [];
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Team CMS</h1>
          <p className="mt-1 text-sm text-muted">
            Members shown on /team when published.
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex self-start bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover"
        >
          + Add member
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="border border-border px-4 py-12 text-center text-muted text-sm">
          No members.{" "}
          <Link href="/admin/team/new" className="text-accent hover:underline">
            Add one
          </Link>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="border border-border bg-card/20 p-4 space-y-2"
              >
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted">{m.role}</p>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <PublishToggle
                    endpoint={`/api/cms/team/${m.id}`}
                    initial={m.is_published}
                  />
                  <Link
                    href={`/admin/team/${m.id}`}
                    className="text-[10px] uppercase tracking-widest text-accent"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-border/60">
                    <td className="px-4 py-3">{m.name}</td>
                    <td className="px-4 py-3 text-muted">{m.role}</td>
                    <td className="px-4 py-3">
                      <PublishToggle
                        endpoint={`/api/cms/team/${m.id}`}
                        initial={m.is_published}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/team/${m.id}`}
                        className="text-[10px] uppercase tracking-widest text-muted hover:text-accent"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
